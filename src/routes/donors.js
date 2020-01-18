const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const db = require("../models/index");

//donor list table
router.get("/", function(req, res, next) {
  //Hi all, remind me to explain what try and catch is

  var donor = db.Donor;

  try {
    donor.findAll({
      attributes: [
        "idNo",
        "name",
        "contactNo",
        "email",
        "dnc",
        [Sequelize.fn('SUM', Sequelize.col('donationAmount')), 'totalAmountDonated']
      ],
      include: [
        {
          model: db.Donation,
          as: "donations",
          attributes: []
        }
      ],
      group: ['Donor.id']
    }).then(donorObj => {
      res.json(donorObj);
    });
  } catch (err) {
    res.status(500).json(err);
  }
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

module.exports = router;
