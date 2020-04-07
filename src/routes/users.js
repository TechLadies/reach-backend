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
  const mailConfig = {
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: 'e1fa9b8d5ae44b',
      pass: 'a199dbc739b3a2',
    },
  }
  const transporter = nodeMailer.createTransport(mailConfig)


  const mailOptions = {
    from: '"Info" <info@example.com>', // sender address

    to: 'kheiboardwarrior@gmail.com', // list of receivers

    subject: 'test', // Subject line

    text: 'hello world, its my first message sent', // plain text body

    html:
      '<b>Hey there! </b><br> This is our first message sent with Nodemailer', // html body
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
});
})

module.exports = router
