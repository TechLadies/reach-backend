const express = require('express');
const router = express.Router();
const debug = require('debug')('app:users');
const db = require('../models/index');

/* GET users listing. */
router.get('/', function (req, res, next) {
  debug('Hello World! dec 2019 here I am ');

  db.User.findAll({
    attributes: ['firstName', 'lastName', 'email']
  }).then(users => {
    res.json(users)
  });
});

router.get('test/', function(req,res,next){
debug('Hello World! dec 2019 here I am ');

db.User.findAll({
  attributes: ['lastName', 'email']
}).then(users => {
  res.json(users)
});
});

