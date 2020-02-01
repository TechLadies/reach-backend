const express = require('express');
const router = express.Router();
const pagination = require('../middlewares/pagination')

const db = require('../models/index');

router.get('/', function (req, res, next) {
  
    db.Upload.findAll().then(uploads => {
    res.json(uploads)
  });

});

module.exports = router;