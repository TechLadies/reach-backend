const express = require("express");
const router = express.Router();
const db = require("../models/index");

//donor list table
router.get("/", function(req, res, next) {
  db.Donor.findAll({
    attributes: ["id", "firstName", "lastName", "contactNo", "email", "dnc"],
    include: [
      {
        model: db.Donation,
        as: "donations",
        attributes: ['donationAmount']
      }
    ]
  }).then(donor => {
    res.json(donor);
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

module.exports = router;
