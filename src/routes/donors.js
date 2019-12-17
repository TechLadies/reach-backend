const express = require("express");
const router = express.Router();
const db = require("../models/index");

router.get("/", function(req, res, next) {
  //debug("Hello World! dec 2019 here I am ");

  db.Donor.findAll({
    attributes: ["id", "email"]
  }).then(donor => {
    res.json(donor);
  });
});




module.exports = router;
