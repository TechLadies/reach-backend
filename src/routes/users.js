const express = require('express')
const router = express.Router()
const debug = require('debug')('app:users')
const db = require('../models/index')

/* GET users listing. */
router.get('/', function (req, res, next) {
  debug('Hello World!')

  db.Users.findAll({
    attributes: ['firstName', 'lastName', 'email']
  }).then(Users => {
    res.json(Users)
  })
})

module.exports = router
