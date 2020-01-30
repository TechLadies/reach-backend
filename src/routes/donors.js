const express = require("express");
const router = express.Router();
const db = require("../models/index");

//donor list table
router.post("/", function(req, res, next) {
  //Hi all, remind me to explain what try and catch is
  try {
    db.Donor.findAll({
      attributes: ['idNo','name', /* what are these? -> "id", "firstName", "lastName",*/ "contactNo", "email", "dnc", 'postalCode'],
      include: [
        {
          model: db.Donation,
          as: "donations",
          attributes: ['donationAmount']
        },
        {
          model: db.Salutation,
          nested: true
        }
      ]
    }).then(donor => {
      res.json(donor);
    });
  } catch (err) {
    res.status(500).json(err)
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
