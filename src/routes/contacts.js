const express = require("express");
const router = express.Router();
const db = require("../models/index");

router.get("/type", (req, res) => {
    db.PreferredContact.findAll({
      attributes: ["id", "description"],
    })
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json(error);
      });
  });
module.exports = router;