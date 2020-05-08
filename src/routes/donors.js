const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const db = require("../models/index");
const pagination = require("../middlewares/pagination");
const _ = require("lodash");
const summation = require("../lib/math");
const BigNumber = require("bignumber.js");
//donor list table
router.get("/", function (req, res, next) {
  const { from, to, taxDeduc, minAmt, maxAmt, source } = req.query;
  const now = new Date ()
  const thisYear = now.getFullYear()
  const defaultFromDate= new Date(thisYear, 0 , 1, 8)
  console.log(defaultFromDate)
  const donationConditions = {};
  const sourceConditions = {};
  const minAmtNum = minAmt ? BigNumber(minAmt) : BigNumber(0);
  const maxAmtNum = maxAmt ? BigNumber(maxAmt) : BigNumber(Infinity);
  if (minAmtNum.isNaN() || maxAmtNum.isNaN()) {
    return res.status(422).json({
      message: "minAmt and/ or maxAmt is not a number",
    });
  }
  if (minAmtNum.isGreaterThan(maxAmtNum)) {
    return res.status(422).json({
      message: "minAmt is more than maxAmt"
    })
  }

  if (from && to) {
    donationConditions.donationDate = {
      [Sequelize.Op.between]: [new Date(from), new Date(to)],
    };
  } else {
    donationConditions.donationDate = { 
    [Sequelize.Op.between]: [defaultFromDate, now]
    }
  }
  if ("taxDeduc" in req.query) {
    donationConditions.taxDeductible = taxDeduc;
  }
  if (source && source.length > 0) {
    sourceConditions.description = source;
  }
  return db.Donor.findAll({
    attributes: ["idNo", "name", "contactNo", "email", "dnc"],
    include: [
      {
        model: db.Donation,
        as: "donations",
        attributes: ["donationAmount", "donationDate", "taxDeductible"],
        where: donationConditions,
        include: [
          {
            model: db.Source,
            attributes: ["id", "description"],
            where: sourceConditions,
          },
        ],
      },
    ],
    group: ["Donor.id", "donations->Source.id", "donations.id"],
    subQuery: false,
  })
    .then((donorObj) => {
      const result = donorListFormat(donorObj).filter(
        (d) =>
          d.totalAmountDonated.isGreaterThanOrEqualTo(minAmtNum) &&
          d.totalAmountDonated.isLessThanOrEqualTo(maxAmtNum)
      );

      return res.json(result);
    })
    .catch((error) => {
      console.log(error)
      return res.status(500).json({message: "A server error has occurred"})
    });
});

function donorListFormat(data) {
  return data.map((d) => ({
    idNo: d.idNo,
    name: d.name,
    contactNo: d.contactNo,
    email: d.email,
    dnc: d.dnc,
    totalAmountDonated: sumDonations(d.donations),
    donations: d.donations,
  }));
}

function sumDonations(donations) {
  const donationAmounts = donations.map((d) => BigNumber(d.donationAmount));
  return summation(donationAmounts);
}

router.get("/count", function (req, res, next) {
  db.Donor.count().then((count) => {
    console.log(count);
    res.json(count);
  });
});

router.get("/sums", function (req, res, next) {
  db.Donation.sum("donationAmount").then((sum) => {
    res.json(sum);
  });
});

router.get("/edit", (req, res) => {
  db.PreferredContact.findAll({
    attributes: ["id", "description"],
  })
    .then((result) => {
      res.json(result);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
});

router.put("/edit/:idNo", (req, res) => {
  const { idNo: donorId } = req.params;
  const { remarks, preferredContact, dnc } = req.body;
  if (!remarks && !preferredContact && !("dnc" in req.body)) {
    return res.status(204).json({
      message: "You have not sent any parameters for updating",
    });
  }
  try {
    const updateParams = {};
    if (remarks) {
      updateParams.remarks = remarks;
    }
    if (preferredContact) {
      updateParams.preferredContactId = preferredContact;
    }
    if ("dnc" in req.body) {
      updateParams.dnc = dnc;
    }
    return db.Donor.update(updateParams, {
      where: { idNo: donorId },
      returning: true,
    }).then(([, result]) => {
      res.json(result);
    });
  } catch (error) {
    res.sendStatus(500).json({
      message: error,
    });
  }
});

//donor details
router.post("/details", function (req, res, next) {
  // GET selected donor of idNo.
  var ic_number = req.body.donorIdNo;

  db.Donor.findOne({
    where: {
      idNo: ic_number,
    },
    include: [
      {
        model: db.Donation,
        as: "donations",
        include: [
          {
            model: db.Source,
            attributes: ["description"],
          },
          {
            model: db.PaymentType,
            attributes: ["description"],
          },
        ],
      },
      {
        model: db.IdType,
        attributes: ["description"],
        as: "idType",
      },
      {
        model: db.Salutation,
        attributes: ["description"],
        as: "salutation",
      },
      {
        model: db.PreferredContact,
        attributes: ["id", "description"],
        as: "preferredContact",
      },
      {
        model: db.ContactPerson,
        attributes: ["name"],
        as: "contactPerson",
      },
    ],
  })
    .then((donorResponse) => {
      if (donorResponse == null) {
        donorResponse = { value: "No donor found" };
      }
      res.status(200).json(categorizedResponse(donorResponse));
      /* res.status(200).json(donorResponse) */
    })
    .catch((error) => {
      res.status(400).send(error);
      console.log(error);
    });
});

const categorizedResponse = (donorResponse) => {
  return {
    details: detailsFormat(donorResponse),
    contact: contactFormat(donorResponse),
    donations: tableFormat(donorResponse),
  };
};

//Donor Details Card response format
function detailsFormat(donorResponse) {
  const donations = _.map(donorResponse.donations, (d) => d.donationAmount);
  const donationSum = summation(donations);
  const idNo = donorResponse.idNo;
  const idType = donorResponse.idType && donorResponse.idType.description;
  const salutation =
    donorResponse.salutation && donorResponse.salutation.description;
  const name = donorResponse.name;
  const dateOfBirth = donorResponse.dateofBirth;
  const donationCount = donorResponse.donations.length;
  const donorRemarks = donorResponse.remarks;
  return {
    idNo,
    idType,
    name,
    salutation,
    dateOfBirth,
    donationCount,
    donationSum,
    donorRemarks,
  };
}
//Contact details Card response format
function contactFormat(donorResponse) {
  const phone = donorResponse.contactNo;
  const email = donorResponse.email;
  const mail =
    donorResponse.address1 +
    " " +
    donorResponse.address2 +
    " " +
    donorResponse.postalCode;
  const preferredContactId =
    donorResponse.preferredContact && donorResponse.preferredContact.id;
  const preferredContact =
    donorResponse.preferredContact &&
    donorResponse.preferredContact.description;
  const contactPerson =
    donorResponse.contactPerson && donorResponse.contactPerson.description;
  const dnc = donorResponse.dnc;

  return {
    phone,
    email,
    mail,
    preferredContactId,
    preferredContact,
    contactPerson,
    dnc,
  };
}

//Donation table response format
function tableFormat(donorResponse) {
  const donationsArr = donorResponse.donations;
  const tableInfo = _.map(donationsArr, (info) => {
    return {
      date: info.donationDate,
      amount: parseFloat(info.donationAmount),
      source: info.donationSource,
      mode: info.PaymentType && info.PaymentType.description,
      tax: info.taxDeductible && info.taxDeductible.description,
      remarks: info.remarks,
    };
  });
  return tableInfo;
}

// TO DO: fully implement the search for donor
router.get("/search", function (req, res) {
  try {
    db.Donor.findAll({
      where: {
        name: {
          [db.Sequelize.Op.iLike]: `%${req.query.name}%`,
        },
      },
      attributes: ["idNo", "name", "contactNo", "email", "dnc"],
      include: [
        {
          model: db.Donation,
          as: "donations",
          attributes: ["donationAmount"],
        },
      ],
    }).then((donorObj) => {
      res.status(200).json(reformat(donorObj));
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

const reformat = (donorObj) => {
  const format = (i) => {
    const donationsArr = _.map(i.donations, (e) => e.donationAmount);
    const totalDonatedAmount = summation(donationsArr);

    console.log(totalDonatedAmount);
    return {
      idNo: i.idNo,
      name: i.name,
      contactNo: i.contactNo,
      email: i.email,
      dnc: i.dnc,
      totalDonatedAmount,
    };
  };
  const reformatArr = _.map(donorObj, format);
  return reformatArr;
};

module.exports = router;
