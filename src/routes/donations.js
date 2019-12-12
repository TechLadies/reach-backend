const express = require('express');
const router = express.Router();

/* GET Donations records. */
router.get('/', function (req, res, next) {
  const { start, end } = req.query;
  console.log(req.query);
  res.status(200).json({});
});

module.exports = router;
