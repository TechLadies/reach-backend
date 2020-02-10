const express = require('express')
const router = express.Router()
const db = require('../models/index')
const _ = require('lodash')
const Sequelize = require("sequelize");

/* GET Donations records. */
router.get('/', function(req, res, next) {
  const { start, end } = req.query
  console.log(req.query)
  res.status(200).json({})
})

router.post("/all", function(req, res, next) {
  // GET Donations records.
  db.Donation.findAll({
    attributes: ['donorId','donationDate', "donationAmount", "donationType", "paymentRef"],
  }).then( donationsResponse => {
    res.status( 200 ).json( donationsResponse )
  })
  .catch( error => {
    res.status( 400 ).send( error )
  })
});

//api for the dashboard
router.post("/dashboard", function(req, res, next) {
  // JSON object
  var response = {};
  var tmp = {};
  // GET selected Donations records.
  var start_date =  req.body.startDate;
  var end_date =  req.body.endDate;
  var startDate = new Date(start_date);
  var endDate = new Date(end_date);
  response["startDate"] = startDate;
  response['endDate'] = endDate;

  db.Donation.findAll({
    attributes: ['donationDate', "donationAmount"],
    where: {
      donationDate: {
        [Sequelize.Op.between]: [startDate, endDate]
      }
    }
  }).then( donationsResponse => {
    response['donationAmt'] = donationsResponse;
  })
  .catch( error => {
    res.status( 400 ).send( error )
  })

  db.Donation.count("donationAmount").then(count => {
    response['totalNoOfDonations'] = count;
  });

  db.Donation.sum("donationAmount").then(sum => {
    response['totalDonationAmt'] = sum;
  });

  db.Donation.findAll({
    attributes: [
      'sourceId',
      [Sequelize.fn('SUM', Sequelize.col('donationAmount')), 'totalAmountDonated']
    ],
    where: {
      donationDate: {
        [Sequelize.Op.between]: [startDate, endDate]
      }
    },
    //groupby
    group: ['sourceId']
  }).then( NoOfDonationBySourceResponse => {
    response['NoOfDonationBySource'] = NoOfDonationBySourceResponse;
    res.status( 200 ).json(response);
  });
});

router.post('/upload', (req, res) => {
  return db.sequelize.transaction(t => {
    return _createCaches()
      .then(caches => {
        return req.body.map(donationWithDonor => {
          _validateIncomingDonor(donationWithDonor)
          _validateIncomingDonation(donationWithDonor)
          // Doing this because they're independent queries and I want to blast through them as fast as possible with a Promise.all
          const foreignQueries = []
          foreignQueries[0] = caches.salutationsCache.findOrCreate(
            donationWithDonor.Salutation
          )
          foreignQueries[1] = caches.idTypeCache.findOrCreate(
            donationWithDonor['ID Type']
          )
          foreignQueries[2] = caches.sourceCache.findOrCreate(
            donationWithDonor.Project
          )
          foreignQueries[3] = caches.paymentTypeCache.findOrCreate(
            donationWithDonor['Type of Payment']
          )

          return previousResult =>
            Promise.all(foreignQueries).then(
              ([salutationId, idTypeId, sourceId, paymentTypeId]) => {
                const donation = {
                  ..._buildDonation(donationWithDonor),
                  sourceId,
                  paymentTypeId
                }
                const donor = {
                  ..._buildDonor(donationWithDonor),
                  idTypeId,
                  salutationId
                }
                return _upsertDonorInsertDonation({
                  donor,
                  donation,
                  transaction: t,
                  previousResult
                })
              }
            )
        })
      })
      .then(promises => {
        return promises.reduce((previousPromise, nextPromise) => {
          return previousPromise.then(_ => nextPromise(_))
        }, Promise.resolve([]))
      })
      .then(results => {
        const deduped = () => {
          return {
            data: _groupDonors(results),
            summary: summary(results)
          }
        }
        res.status(200).send(deduped())
      })
      .catch(e => {
        console.log(e)
        _handleError(res, e)
      })
  })
})

module.exports = router

/*** Utils ***/

/**
 * Fetches all existing salutations, idTypes, sources and payment types
 * and loads them in memory so we reduce the number of DB hits.
 */
function _createCaches() {
  const salutationsCache = _simpleCache(db.Salutation)
  const idTypeCache = _simpleCache(db.IdType)
  const sourceCache = _simpleCache(db.Source)
  const paymentTypeCache = _simpleCache(db.PaymentType)
  return Promise.all([
    salutationsCache.populate(),
    idTypeCache.populate(),
    sourceCache.populate(),
    paymentTypeCache.populate()
  ]).then(() => {
    return {
      salutationsCache,
      idTypeCache,
      sourceCache,
      paymentTypeCache
    }
  })
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
      return Model.findAll().then(items => {
        const obj = items.reduce((cache, model) => {
          cache[model.description] = model.id
          return cache
        }, {})
        this.data = obj
        return this
      })
    },
    findOrCreate(description) {
      if (!description) return Promise.resolve()
      const found = this.data[description]
      if (found) {
        return Promise.resolve(found)
      }
      return Model.create({
        description
      }).then(model => {
        this.data[description] = model.id
        return model.id
      })
    }
  }
}

const transformDate = (date) => {
  return ((date.split('/')).reverse()).join('-')
}

function _buildDonation(csvDonation) {
  return {
    donationDate: transformDate(csvDonation['Date of Donation']),
    donationAmount: csvDonation['Amount'],
    donationType: csvDonation['Type of Donation'],
    remarks: csvDonation['Remarks'],
    receiptNo: csvDonation['Receipt Serial No'],
    void: csvDonation['Void'],
    taxDeductible: csvDonation['Tax Deductible'] || false
  }
}

function _buildDonor(csvDonation) {
  return {
    idNo: csvDonation['ID No'] || null,
    name: csvDonation['Name'],
    email: csvDonation['Email Address'],
    contactNo: csvDonation['Tel No'],
    address1: csvDonation['Add 1'],
    address2: csvDonation['Add 2'],
    postalCode: csvDonation['Postal Code']
  }
}

/**
 * Helper to sequentially upsert a Donor then insert a Donation
 */
function _upsertDonorInsertDonation({
  donor,
  donation,
  transaction,
  previousResult
}) {
  return db.Donor.upsert(donor, {
    transaction,
    returning: true
  }).then(([donor, created]) => {
    return new Promise(res => {
      return db.Donation.create(
        {
          ...donation,
          donorId: donor.id
        },
        {
          transaction
        }
      ).then(() =>
        res([
          ...previousResult,
          { ...donor.toJSON(), __isNew: created, ...donation }
        ])
      )
    })
  })
}

function _validateIncomingDonor(incoming) {
  // Nothing here yet
}
function _validateIncomingDonation(incoming) {
  if (!incoming['Receipt Serial No']) {
    throw new ValidationError('Missing field in Donation: Receipt Serial No')
  }
}

/* The upload can contain multiple donations by the same donor.
 * This dedupes them, also making sure that if a donor was
 * created and then updated in the same upload,
 * they are marked as a *new* donor.
 */

function _groupDonors(results) {
  const groupById = _.groupBy(results, 'id')
  const groupedArr = _.map(groupById, (details, id) => {
    const donationCount = details.length
    const sum = details.reduce((sum, donation) => {
      return sum + donation.donationAmount
    }, 0)
    const name = _.last(details).name
    const idNo = _.last(details).idNo
    const __isNew = _.first(details).__isNew

    return {
      id,
      idNo,
      name,
      totalAmount: sum,
      donationCount,
      __isNew
    }
  })

  return groupedArr
}

function summary(results) {
  const donations = _.map(results, el => el.donationAmount)
  const totalAmt = donations.reduce((sum, donation) => {
    return sum + donation
  }, 0)
  const totalCount = results.length
  const dateFormatter = _.map(results, el => Date.parse(el.donationDate))
  const maxDate = dateStringOf(new Date(Math.max.apply(null, dateFormatter)))
  const minDate = dateStringOf(new Date(Math.min.apply(null, dateFormatter)))
  const period = () => {
    if (minDate.year === maxDate.year) {
      if (minDate.month === maxDate.month) {
        return `${minDate.day} - ${maxDate.day} ${maxDate.month} ${maxDate.year}`
      } else {
        return `${minDate.dateMonth} - ${maxDate.dateMonth} ${maxDate.year}`
      }
    } else {
      return `${minDate.fullDate} - ${maxDate.fullDate}`
    }
  }

  return { totalCount, totalAmt, period: period() }
}

function dateStringOf(date) {
  const day = date.getDate()
  const year = date.getFullYear()
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  const month = months[date.getMonth()]
  const fullDate = day + ' ' + month + ' ' + year
  const dateMonth = day + ' ' + month

  return { day, month, year, fullDate, dateMonth }
}

function _handleError(res, e) {
  switch (e.constructor) {
    case ValidationError: {
      return res
        .status(400)
        .send({ message: e.message, errorType: 'ValidationError' })
    }
    default: {
      return res
        .status(500)
        .send({ message: 'Server Error', errorType: 'Unknown Error' })
    }
  }
}

class ValidationError extends Error {
  constructor(...params) {
    super(...params)
    this.name = 'ValidationError'
  }
}
