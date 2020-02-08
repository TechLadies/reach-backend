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
  console.log("hello world");
  db.Donor.update(
    {
      email: req.body.email
    },
    {
      where: {
        id: req.params.id
      }
    }
  ).then(result => res.json(result));
});

//donor details
router.post("/details", function(req, res, next) {
  // GET selected donor of idNo.
  var ic_number =  req.body.donorIdNo;

  db.Donor.findAll({
    // attributes: [
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
