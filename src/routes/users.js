const express = require('express')
const router = express.Router()
const debug = require('debug')('app:users')
const db = require('../models/index')
const nodeMailer = require('nodemailer')

/* GET users listing. */
router.get('/', function (req, res, next) {
  debug('Hello World! dec 2019 here I am ')

  db.User.findAll({
    attributes: ['firstName', 'lastName', 'email'],
  }).then((users) => {
    res.json(users)
  })

  // db,User,finOne({ where:  {email:'Tan@techladies' }}}
})

router.get('/:surname', (req, res) => {
  console.log(req.params.surname)
  console.log('haha')
  db.User.findOne({
    where: { lastName: req.params.surname },
    attributes: ['firstName', 'lastName', 'email'],
  }).then((users) => {
    res.json(users)
  })
})

router.get('test/', function (req, res, next) {
  debug('Hello World! dec 2019 here I am ')

  db.User.findAll({
    attributes: ['lastName', 'email'],
  }).then((users) => {
    res.json(users)
  })
})

router.post('/send_email', function (req, res, next) {
  nodeMailer.createTestAccount((err, account) => {
    const transporter = nodeMailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        // should be replaced with real sender's account
        user: account.user,
        pass: account.pass,
      },
    })
  })

  let mailOptions = {
    from: '"Info" <info@example.com>', // sender address

    to: "kheiboardwarrior@gmail.com", // list of receivers

    subject: "test", // Subject line

    text: "hello world", // plain text body

    html: emailbody, // html body
  }
})

module.exports = router
