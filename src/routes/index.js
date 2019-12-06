const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send('hello users. from techladies');
  res.render('index', { title: 'TechLadies' });
});

module.exports = router;
