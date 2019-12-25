const express = require('express');
const router = express.Router();
const pagination = require('../middlewares/pagination')

/* GET Salutations records. */

const db = require('../models/index');

router.get('/', function (req, res, next) {
  db.Salutation.findAll().then(users => {
    res.json(users)
  });
});

module.exports = router;
