const express = require('express')
const router = express.Router()
const pagination = require('../middlewares/pagination')

const db = require('../models/index')

router.get('/', function (req, res, next) {
  db.Upload.findAll().then((uploads) => {
    res.json(uploads)
  })
})

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

router.post('/', (req, res) => {
  const uploadDate = req.body.createdAt
  const firstDate = req.body.firstDate
  const lastDate = req.body.lastDate
  db.Upload.create({
    uploadDate: uploadDate,
    firstDate: firstDate,
    lastDate: lastDate
  }).then((newUpload) => {
    console.log(
      `New ${newUpload.uploadDate} ${newUpload.firstDate} ${newUpload.lastDate},  has been created.`
    )
    res.json(newUpload)
  })
})

module.exports = router
