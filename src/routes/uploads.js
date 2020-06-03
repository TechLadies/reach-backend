const express = require('express')
const router = express.Router()
const pagination = require('../middlewares/pagination')
const db = require('../models/index')

router.get('/latest', function (req, res, next) {
  db.Upload.findAll({
    order: [['createdAt', 'DESC']],
  }).then((uploads) => {
    if (uploads.length === 0) {
      return res.status(204).end()
    }
    res.json(uploads[0])
  })
})


module.exports = router
