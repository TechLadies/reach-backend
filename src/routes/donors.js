const express = require('express')
const router = express.Router()
const Sequelize = require('sequelize')
const db = require('../models/index')
const pagination = require('../middlewares/pagination')
const _ = require('lodash')

//donor list table
router.get('/', pagination, function(req, res, next) {
  let offset = req.customParams.offset
  let limit = req.customParams.limit

  var donor = db.Donor
  const now = new Date()
  const thisYear = now.getFullYear()
  const thisMonth = now.getMonth()
  const thisDate = now.getDate()
  // const {
  //   from = new Date(thisYear, 0, 1).toISOString(),
  //   to = new Date(thisYear, thisMonth, thisDate).toISOString(),
  //   page = 1
  // } = req.query;

  //   try {
  //     const donors = await db.Donor.findAll({
  //       limit: limit,
  //       offset: offset,
  //       order: [["id", "ASC"]]
  //     });
  //     res.json({
  //       data: donors,
  //       perPage: limit,
  //       offset: offset
  //     });
  //   } catch (err) {
  //     console.log(err);
  //     res.status(500).json(err);
  //   }
  // });

  try {
    donor
      .findAll({
        limit: limit,
        offset: offset,
        // where (for advanced filters)
        attributes: [
          'idNo',
          'name',
          'contactNo',
          'email',
          'dnc',
          [
            Sequelize.fn('SUM', Sequelize.col('donationAmount')),
            'totalAmountDonated'
          ]
        ],
        include: [
          {
            model: db.Donation,
            as: 'donations',
            // where: {
            //   donationDate: {
            //     [Sequelize.Op.between]: [new Date(from), new Date(to)
            // ]
            //   }
            // },
            // include: [
            //   {
            //     model: db.Source
            //   }
            // ]
            attributes: []
          }
        ],
        group: ['Donor.id'],
        subQuery: false
      })
      .then(donorObj => {
        res.json({
          data: donorObj,
          perPage: limit,
          offset: offset
        })
      })
  } catch (err) {
    res.status(500).json(err)
  }
})

router.get('/count', function(req, res, next) {
  db.Donor.count().then(count => {
    console.log(count)
    res.json(count)
  })
})

router.get('/sums', function(req, res, next) {
  db.Donation.sum('donationAmount').then(sum => {
    res.json(sum)
  })
})

router.put('/updatedonors/:id', (req, res) => {
  console.log('hello world')
  db.Donor.update(
    {
      email: req.body.email
    },
    {
      where: {
        id: req.params.id
      }
    }
  ).then(result => res.json(result))
})

//donor details
router.post('/details', function(req, res, next) {
  // GET selected donor of idNo.
  var ic_number = req.body.donorIdNo

  db.Donor.findOne({
    // attributes: [
    //   "id",
    //   "idNo",
    //   "name",
    //   "contactNo",
    //   "email",
    //   "dnc",
    //   [Sequelize.fn("SUM", Sequelize.col("donationAmount")),"totalAmountDonated"]
    // ],
    where: {
      idNo: ic_number
    },
    include: [
      {
        model: db.Donation,
        as: 'donations',
        include: [
          {
            model: db.Source,
            attributes: ['description']
          },
          {
            model: db.PaymentType,
            attributes: ['description']
          }
        ]
      },
      {
        model: db.IdType,
        attributes: ['description'],
        as: 'idType'
      },
      {
        model: db.Salutation,
        attributes: ['description'],
        as: 'salutation'
      },
      {
        model: db.PreferredContact,
        attributes: ['description'],
        as: 'preferredContact'
      },
      {
        model: db.ContactPerson,
        attributes: ['name'],
        as: 'contactPerson'
      }
    ]
  })
    .then(donorResponse => {
  
      if (donorResponse == null) {
        donorResponse = { value: 'No donor found' }
      }
      res.status(200).json(categorizedResponse(donorResponse))
       /* res.status(200).json(donorResponse) */
    })
    .catch(error => {
      res.status(400).send(error)
      console.log(error)
    })
})

const categorizedResponse = (donorResponse) => {
  return {
    details: detailsFormat(donorResponse),
    contact: contactFormat(donorResponse),
    donations: tableFormat(donorResponse)
  }
}

//Donor Details Card response format
function detailsFormat(donorResponse) {
  const donationSum = _.sumBy(donorResponse.donations, d => parseFloat(d.donationAmount))
  const idNo = donorResponse.idNo
  const idType = donorResponse.idType && donorResponse.idType.description
  const salutation = donorResponse.salutation && donorResponse.salutation.description
  const name = donorResponse.name
  const dateOfBirth = donorResponse.dateofBirth
  const donationCount = donorResponse.donations.length
  const donorRemarks = donorResponse.remarks
  return {
    idNo,
    idType,
    name,
    salutation,
    dateOfBirth,
    donationCount,
    donationSum,
    donorRemarks
  }
}
//Contact details Card response format
function contactFormat(donorResponse) {
  const phone = donorResponse.contactNo
  const email = donorResponse.email
  const mail = donorResponse.address1 + ' ' + donorResponse.address2 + ' ' + donorResponse.postalCode
  const preferredContact = donorResponse.preferredContact && donorResponse.preferredContact.description
  const contactPerson = donorResponse.contactPerson && donorResponse.contactPerson.description
  const dnc = donorResponse.dnc

  return { phone, email, mail, preferredContact, contactPerson, dnc }
}

//Donation table response format
function tableFormat(donorResponse) {
  const donationsArr = donorResponse.donations
  const tableInfo = _.map(donationsArr, info => {
    return {
      date: info.donationDate,
      amount: parseFloat(info.donationAmount),
      source: info.donationSource,
      mode: info.PaymentType && info.PaymentType.description,
      tax: info.taxDeductible && info.taxDeductible.description,
      remarks: info.remarks
    }
  })
  return tableInfo
}

// TO DO: fully implement the search for donor
router.get('/search', function(req, res) {
  try {
    db.Donor.findAll({
      where: {
        name: {
          [db.Sequelize.Op.iLike]: `%${req.query.name}%`
        }
      },
      attributes: ['idNo', 'name', 'contactNo', 'email', 'dnc']
    }).then(donorObj => {
      res.status(200).json(donorObj)
    })
  } catch (err) {
    res.status(500).json(err)
  }
})

module.exports = router
