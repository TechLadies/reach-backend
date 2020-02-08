const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const db = require("../models/index");
const pagination = require("../middlewares/pagination");

//donor list table
router.get("/", pagination, function(req, res, next) {
  let offset = req.customParams.offset;
  let limit = req.customParams.limit;

  var donor = db.Donor;
  const now = new Date();
  const thisYear = now.getFullYear();
  const thisMonth = now.getMonth();
  const thisDate = now.getDate();
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
          "idNo",
          "name",
          "contactNo",
          "email",
          "dnc",
          [
            Sequelize.fn("SUM", Sequelize.col("donationAmount")),
            "totalAmountDonated"
          ]
        ],
        include: [
          {
            model: db.Donation,
            as: "donations",
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
        group: ["Donor.id"],
        subQuery: false
      })
      .then(donorObj => {
        res.json({
          data: donorObj,
          perPage: limit,
          offset: offset
        });
      });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/count", function(req, res, next) {
  db.Donor.count().then(count => {
    console.log(count);
    res.json(count);
  });
});

router.get("/sums", function(req, res, next) {
  db.Donation.sum("donationAmount").then(sum => {
    res.json(sum);
  });
});

router.put("/updatedonors/:id", (req, res) => {
  const { id: donorId } = req.params
  const { remarks, preferredContact } = req.body
  if (!remarks && !preferredContact) {
    return res.sendStatus(204).json({
      message: "You have not sent any parameters for updating"
    })
  }
  try {
    // We may or may not need to do this findOne, depending on whether the preferred contact is being updated.
    let prom = Promise.resolve({})
    if (preferredContact) {
      prom = db.PreferredContact.findOne({
        where: {
          description: preferredContact
        }
      })
    }
    prom
    .then((preferredContact) => {
      let updateParams = {}
      if (remarks) {
        updateParams.remarks = remarks
      }
      if (preferredContact) {
        updateParams.preferredContactId = preferredContact.id
      }
      return db.Donor.update(
        updateParams,
        {
          where: { id: donorId },
          returning: true
        },
      )
    })
    .then(([, result]) => {
      res.json(result)
    });
  } catch {
    res.sendStatus(500).json({
      message: 'Server Error'
    })
  }
});

//donor details
router.post("/details", function(req, res, next) {
  // GET selected donor of idNo.
  var ic_number =  req.body.donorIdNo;
  
  db.Donor.findAll({
    attributes: [
      "idNo",
      "name",
      "contactNo",
      "email",
      "dnc",
      [Sequelize.fn("SUM", Sequelize.col("donationAmount")),"totalAmountDonated"]
    ],
    where: {
      idNo: ic_number
    },
    include: [
      {
        model: db.Donation,
        as: "donations",
        attributes: []
      }
    ],
    group: ["Donor.id"]
  }).then( donorResponse => {
    res.status( 200 ).json(donorResponse);
  })
  .catch( error => {
    res.status( 400 ).send( error )
  });
});

// TO DO: fully implement the search for donor
router.get("/search", function(req, res, next) {
  try {
    db.Donor.findOne({
      name : req.params.name,
      attributes: [
        "idNo",
        "name",
        "contactNo",
        "email",
        "dnc"
      ]
    }
  ).then(donorObj => {
      res.json(donorObj);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;