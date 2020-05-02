const express = require('express')
const router = express.Router()
const debug = require('debug')('app:users')
const db = require('../models/index')

router.get("/", (req, res) => {
    db.Source.findAll({
      attributes: ["id", "description"],
    })
      .then((result) => {
        res.json(result);
      })
      .catch((error) => {
        res.status(500).json(error);
      });
  });
  module.exports = router;