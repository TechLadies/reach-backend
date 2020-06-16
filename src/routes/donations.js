const express = require("express");
const router = express.Router();
const db = require("../models/index");
const _ = require("lodash");
const Sequelize = require("sequelize");
const summation = require("../lib/math");

//api for the dashboard
router.post("/dashboard", function (req, res, next) {
  // JSON object
  var response = {};
  var tmp = {};
  // GET selected Donations records.
  var start_date = req.body.startDate;
  var end_date = req.body.endDate;
  var startDate = new Date(start_date);
  var endDate = new Date(end_date);
  var source = db.Source;
  response["startDate"] = startDate;
  response["endDate"] = endDate;

  const queries = [];
  queries[0] = db.Donation.findAll({
    attributes: [
      "donationDate",
      [Sequelize.fn("SUM", Sequelize.col("donationAmount")), "donationAmount"],
    ],
    group: ["donationDate"],
    order: ["donationDate"],
    where: {
      donationDate: {
        [Sequelize.Op.between]: [startDate, endDate],
      },
    },
  });
  queries[1] = db.Donation.sum("donationAmount");

  queries[2] = db.Donation.count("donationAmount");

  queries[3] = db.Donation.findAll({
    attributes: [
      [
        Sequelize.fn("", Sequelize.col("Source.description")),
        "sourceDescription",
      ],
      [
        Sequelize.fn("SUM", Sequelize.col("donationAmount")),
        "totalAmountDonated",
      ],
    ],
    where: {
      donationDate: {
        [Sequelize.Op.between]: [startDate, endDate],
      },
    },
    order: [[Sequelize.fn("SUM", Sequelize.col("donationAmount")), "DESC"]],
    limit: 5,
    //groupby
    include: [
      {
        model: db.Source,
        attributes: [],
      },
    ],
    group: ["Source.description", "Source.id"],
  });

  Promise.all(queries)
    .then(
      ([donationAmt, totalDonationAmt, totalNoOfDonations, donationSource]) => {
        response["totalDonationAmt"] = totalDonationAmt;
        response["totalNoOfDonations"] = totalNoOfDonations;
        response["donationAmt"] = donationAmt;
        response["NoOfDonationBySource"] = donationSource;
        res.status(200).json(response);
      }
    )
    .catch((error) => {
      console.log(error)
      res.status(400).send(error);
    });
});

router.post("/upload", (req, res) => {
  const requestBody = req.body;
  return db.sequelize.transaction((t) => {
    return _createCaches()
      .then((caches) => {
        return req.body.map((donationWithDonor) => {
          _validateIncomingDonor(donationWithDonor);
          _validateIncomingDonation(donationWithDonor);
          // Doing this because they're independent queries and I want to blast through them as fast as possible with a Promise.all
          const foreignQueries = [];
          foreignQueries[0] = (_donationWithDonor) =>
            caches.salutationsCache.findOrCreate(_donationWithDonor.Salutation);
          foreignQueries[1] = (_donationWithDonor) =>
            caches.idTypeCache.findOrCreate(_donationWithDonor["ID Type"]);
          foreignQueries[2] = (_donationWithDonor) =>
            caches.sourceCache.findOrCreate(_donationWithDonor.Project);
          foreignQueries[3] = (_donationWithDonor) =>
            caches.paymentTypeCache.findOrCreate(
              _donationWithDonor["Type of Payment"]
            );

          return (previousResult) =>
            Promise.all(foreignQueries.map((fq) => fq(donationWithDonor))).then(
              ([salutationId, idTypeId, sourceId, paymentTypeId]) => {
                const donation = {
                  ..._buildDonation(donationWithDonor),
                  sourceId,
                  paymentTypeId,
                };
                const donor = {
                  ..._buildDonor(donationWithDonor),
                  idTypeId,
                  salutationId,
                };
                return _upsertDonorInsertDonation({
                  donor,
                  donation,
                  transaction: t,
                  previousResult,
                });
              }
            );
        });
      })
      .then((promises) => {
        return promises.reduce((previousPromise, nextPromise) => {
          return previousPromise.then((_) => nextPromise(_));
        }, Promise.resolve([]));
      })
      .then((result) => {
        return _insertUploadRecord({ requestBody, t }).then(() => result);
      })
      .then((results) => {
        const deduped = () => {
          return {
            data: _groupDonors(results),
            summary: summary(results),
          };
        };
        res.status(200).send(deduped());
      })
      .catch((e) => {
        console.log(e);
        _handleError(res, e);
      });
  });
});

module.exports = router;

/*** Utils ***/

/**
 * Fetches all existing salutations, idTypes, sources and payment types
 * and loads them in memory so we reduce the number of DB hits.
 */
function _createCaches() {
  const salutationsCache = _simpleCache(db.Salutation);
  const idTypeCache = _simpleCache(db.IdType);
  const sourceCache = _simpleCache(db.Source);
  const paymentTypeCache = _simpleCache(db.PaymentType);
  return Promise.all([
    salutationsCache.populate(),
    idTypeCache.populate(),
    sourceCache.populate(),
    paymentTypeCache.populate(),
  ]).then(() => {
    return {
      salutationsCache,
      idTypeCache,
      sourceCache,
      paymentTypeCache,
    };
  });
}

/**
 * "Cache" to load all records of a particular model in memory, then
 * return the ID from memory, or create the new record and return
 * the newly-created ID
 */
function _simpleCache(Model) {
  return {
    data: {},
    populate() {
      return Model.findAll().then((items) => {
        const obj = items.reduce((cache, model) => {
          cache[model.description] = model.id;
          return cache;
        }, {});
        this.data = obj;
        return this;
      });
    },
    findOrCreate(description) {
      if (!description) return Promise.resolve();
      const found = this.data[description];
      if (found) {
        return Promise.resolve(found);
      }
      return Model.create({
        description,
      }).then((model) => {
        this.data[description] = model.id;
        return model.id;
      });
    },
  };
}

function _buildDonation(csvDonation) {
  return {
    donationDate: csvDonation["Date of Donation"],
    donationAmount: csvDonation["Amount"],
    donationType: csvDonation["Type of Donation"],
    remarks: csvDonation["Remarks"],
    receiptNo: csvDonation["Receipt Serial No"],
    void: csvDonation["Void"],
    taxDeductible: isTaxDeductible(csvDonation["Name of Fund"]),
  };
}

function _buildDonor(csvDonation) {
  return {
    idNo: csvDonation["ID No"] || null,
    name: csvDonation["Name"],
    email: csvDonation["Email Address"],
    contactNo: csvDonation["Tel No"],
    address1: csvDonation["Add 1"],
    address2: csvDonation["Add 2"],
    postalCode: csvDonation["Postal Code"],
  };
}

function isTaxDeductible(data) {
  if (data === "Non-Tax Deductible Donations") {
    return false;
  } else {
    return true;
  }
}
/**
 * Helper to sequentially upsert a Donor then insert a Donation
 */
function _upsertDonorInsertDonation({
  donor,
  donation,
  transaction,
  previousResult,
}) {
  return db.Donor.upsert(donor, {
    transaction,
    returning: true,
  }).then(([donor, created]) => {
    return new Promise((res, rej) => {
      return db.Donation.upsert(
        {
          ...donation,
          donorId: donor.id,
        },
        {
          transaction,
        }
      ).then(() =>
        res([
          ...previousResult,
          { ...donor.toJSON(), __isNew: created, ...donation },
        ])
      ).catch(e => rej(e));
    });
  });
}

function _insertUploadRecord({ requestBody, transaction }) {
  const donationDateArr = requestBody.map((entry) =>
    Date.parse(entry["Date of Donation"])
  );
  const period = {};
  const sorted = _.sortBy(donationDateArr);
  period["firstDate"] = new Date(sorted[0]);
  period["lastDate"] = new Date(sorted[sorted.length - 1]);
  return db.Upload.create(period, { transaction });
}

function _validateIncomingDonor(incoming) {
  //Nothing here yet
}
function _validateIncomingDonation(incoming) {
  if (!incoming["Receipt Serial No"]) {
    throw new ValidationError("Missing field in Donation: Receipt Serial No");
  }
}

/* The upload can contain multiple donations by the same donor.
 * This dedupes them, also making sure that if a donor was
 * created and then updated in the same upload,
 * they are marked as a *new* donor.
 */

function _groupDonors(results) {
  const groupById = _.groupBy(results, "id");
  const groupedArr = _.map(groupById, (details, id) => {
    const donationsArr = _.map(details, (d) => d.donationAmount);
    const donationCount = _.uniqBy(details, r => r.receiptNo).length
    const sum = summation(donationsArr);
    const name = _.last(details).name;
    const idNo = _.last(details).idNo;
    const __isNew = _.first(details).__isNew;

    return {
      id,
      idNo,
      name,
      totalAmount: sum,
      donationCount,
      __isNew,
    };
  });

  return groupedArr;
}

function summary(results) {
  const donations = _.map(results, (el) => el.donationAmount);
  const totalAmt = summation(donations);
  const totalCount = _.uniqBy(results, r => r.receiptNo).length
  const dateFormatter = _.map(results, (el) => Date.parse(el.donationDate));
  const maxDate = new Date(Math.max.apply(null, dateFormatter));
  const minDate = new Date(Math.min.apply(null, dateFormatter));

  return { totalCount, totalAmt, maxDate, minDate };
}

function _handleError(res, e) {
  switch (e.constructor) {
    case ValidationError: {
      return res
        .status(400)
        .send({ message: e.message, errorType: "ValidationError" });
    }
    default: {
      return res
        .status(500)
        .send({ message: "Server Error", errorType: "Unknown Error" });
    }
  }
}

class ValidationError extends Error {
  constructor(...params) {
    super(...params);
    this.name = "ValidationError";
  }
}
