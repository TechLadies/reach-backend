const express = require('express')
const router = express.Router()
const debug = require('debug')('app:users')
const db = require('../models/index')
/* const nodeMailer = require('nodemailer') */
const crypto = require('crypto')
const bcrypt = require('bcrypt')

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

router.post('/reset_password_email', function (req, res, next) {
  //  user by email
  db.User.findOne({
    where: { email: req.body.email },
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
            resetPasswordExpiry: Date.now() + oneDay,
          },
          {
            where: { id: user.id },
            returning: true,
          }
        )
          .then(([, updated]) => {
            sendEmail(updated[0])
          })
          .catch((err) => console.log(err))
      })
    } else if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
  }

  // send email with token to the user
  function sendEmail(user) {
    const mailConfig = {
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD,
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
        name: user.firstName,
      },
      html: `<body>
      <div>
          <h3>Dear ${user.firstName},</h3>
          <br>
          <p>You requested for a password reset, kindly use this
           <a href="http://reach-frontend.herokuapp.com/reset-password?token=${user.resetPasswordToken}">link</a>
            to reset your password. This link is valid for one day.
          </p>
          <br>
          <p>Cheers!</p>
      </div>
     
  </body>`,
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (!error) {
        return res.json({
          message: `Kindly check your email for further instructions`,
        })
      } else {
        console.log(error)
        return res.status(500).json({
          message:
            'Oops there is an error...Please try again or contact your admin if the issue persist',
        })
      }
    })
  }
})

router.put('/reset_password', function (req, res, next) {
  const { token, password1, password2 } = req.body
  if (!password1 || !password2) {
    return res.status(422).json({
      message: 'Oops! Please check that you have entered both passwords field',
    })
  }
  if (password1 !== password2) {
    return res
      .status(422)
      .json({ message: 'Oops! The passwords you entered do not match' })
  }

  if (password1 === password2) {
    return db.User.findOne({
      where: { resetPasswordToken: token },
    })
      .then((result) => {
        if (!result) {
          return res.status(401).json({
            message:
              'Invalid token. Please request for password reset email again',
          })
        }
        if (result.resetPasswordExpiry <= Date.now()) {
          return res.status(401).json({
            message:
              'Token has expired. Please request for password reset email again'
          })
        } else {
          const bcryptedPassword = bcrypt.hashSync(
            password1,
            bcrypt.genSaltSync()
          )
          return db.User.update(
            {
              passwordHash: bcryptedPassword,
              resetPasswordExpiry: Date.now()
            },
            { where: { resetPasswordToken: token }, returning: true }
          )
            .then(([, updated]) => {
              if (updated) {
                res.status(200).json({ message: 'Password reset complete' })
              }
            })
            .catch((err) => console.log(err))
        }
      })
      .catch((err) => console.log(err))
  }
})

const oneDay = 86400000
module.exports = router
