const express = require('express')
const router = express.Router()
const debug = require('debug')('app:users')
const db = require('../models/index')
const nodeMailer = require('nodemailer')
const crypto = require('crypto')

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
module.exports = router

router.post('/send_email', function (req, res, next) {
  //  user by email
  db.User.findOne({
    where: { email: req.body.email }
  })
    .then((user) => generateStoreSendToken(user))
    .catch((err) => console.log(err))

  // if user exist, generate and store token in User table
  function generateStoreSendToken(user) {
    if (user) {
      return crypto.randomBytes(127, function (err, buffer) {
        if (err) throw err
        const token = buffer.toString('hex')
        return db.User.update(
          {
            resetPasswordToken: token,
            resetPasswordExpiry: Date.now() + 86400000,
          },
          {
            where: { id: user.id },
            returning: true
          }
        )
          .then(([, updated]) => {
            sendEmail(updated[0])
          })
          .catch((err) => console.log(err))
      })
    } else {
      user = { value: 'User does not exist' }
    }
  }

  // send email with token to the user
  function sendEmail(user) {
    const mailConfig = {
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: 'e1fa9b8d5ae44b',
        pass: 'a199dbc739b3a2'
      },
    }
    const transporter = nodeMailer.createTransport(mailConfig)
    const mailOptions = {
      from: '"Info" <info@example.com>', // sender address

      to: user.email, // list of receivers

      subject: 'Reset Password', // Subject line
      context: {
        url:
          'http://localhost:3000/reset_password?token=' +
          user.resetPasswordToken,
        name: user.firstName
      },
      // text: `Dear , you have requested for a password reset. Please click on the password reset link`, // plain text body

      html: `<b>Dear ${user.firstName} </b><br> you have requested for a password reset. Please click on the password reset link : http://localhost:3000/reset_password?token= + ${user.resetPasswordToken}`, // html body
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (!error) {
        return res.json({
          message: `${info.messageId} sent! Kindly check your email for further instructions`,
        })
      } else {
        return console.log(error)
      }
    })
  }
})
