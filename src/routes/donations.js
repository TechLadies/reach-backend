const express = require('express')
const router = express.Router()
const db = require('../models/index')
const uniqBy = require('lodash.uniqby')

/* GET Donations records. */
router.get('/', function(req, res, next) {
  const { start, end } = req.query
  console.log(req.query)
  res.status(200).json({})
})

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
                  transation: t,
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
        const deduped = _dedupeDonors(results)
        res.status(200).send(deduped)
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

function _buildDonation(csvDonation) {
  return {
    donationDate: csvDonation['Date of Donation'],
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
      return db.Donation.create({
        ...donation,
        donorId: donor.id
      }, {
        transaction
      }).then(() =>
        res([...previousResult, { ...donor.toJSON(), __isNew: created }])
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
function _dedupeDonors(results) {
  return uniqBy(results, donor => donor.id && donor.__isNew).reduce(
    (donors, donor) => {
      const idx = donors.findIndex(d => d.id === donor.id)
      if (idx < 0) {
        // have not encountered this donor yet
        donors.push(donor)
      } else if (donors[idx].__isNew && !donor.__isNew) {
        // existing is new, incoming is updated:
        // take updated details and mark as new
        donors[idx] = donor
        donors[idx].__isNew = true
      } else {
        // we should not reach here
        donors[idx] = donor
      }
      return donors
    },
    []
  )
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
