const express = require("express");
const router = express.Router();
const debug = require("debug")("app:users");
const db = require("../models/index");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_TECHLADIES_TEMP_API);

router.post("/reset_password_email", function (req, res, next) {
  //  user by email
  db.User.findOne({
    where: { email: req.body.email },
  })
    .then((user) => generateStoreSendToken(user))
    .catch((err) => console.log(err));

  // if user exist, generate and store token in User table
  function generateStoreSendToken(user) {
    if (user) {
      return crypto.randomBytes(127, function (err, buffer) {
        if (err) throw err;
        const token = buffer.toString("hex");
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
            sendEmail(updated[0]);
          })
          .catch((err) => console.log(err));
      });
    } else if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  }

  // send email with token to the user
  function sendEmail(user) {
    const msg = {
      to: `${user.email}`,
      from: "'REACH Temporary Account' <reach_donotreply@example.com>",
      subject: "REACH account password reset",
      html: `<body>
      <div>
          <h3>Dear ${user.firstName},</h3>
          <br>
          <p>You requested for a password reset, kindly use this
           <a href="http://reach-dms-frontend.herokuapp.com/reset-password?token=${user.resetPasswordToken}">link</a>
            to reset your password. This link is valid for one day.
          </p>
          <br>
          <p>Cheers!</p>
      </div>
     
  </body>`,
    };
    sgMail
      .send(msg)
      .then(
        (emailSent) => {
          let statusCode = emailSent[0].statusCode
          if (statusCode === 202) {
            return res.status(statusCode).json({
              message: `Kindly check your email for further instructions`,
            }) 
          } 
        }
      )
      .catch((error) => {
        statusCode = error.code
        let errorMsg = error.message
        console.log(error)
          return res.status(statusCode).json({
            message:
              `Oops ${errorMsg} error...Please try again or contact your admin if the issue persist`,
          });
        
      });
  }
});

router.put("/reset_password", function (req, res, next) {
  const { token, password1, password2 } = req.body;
  if (!password1 || !password2) {
    return res.status(422).json({
      message: "Oops! Please check that you have entered both passwords field",
    });
  }
  if (password1 !== password2) {
    return res
      .status(422)
      .json({ message: "Oops! The passwords you entered do not match" });
  }

  if (password1 === password2) {
    return db.User.findOne({
      where: { resetPasswordToken: token },
    })
      .then((result) => {
        if (!result) {
          return res.status(401).json({
            message:
              "Invalid token. Please request for password reset email again",
          });
        }
        if (result.resetPasswordExpiry <= Date.now()) {
          return res.status(401).json({
            message:
              "Token has expired. Please request for password reset email again",
          });
        } else {
          const bcryptedPassword = bcrypt.hashSync(
            password1,
            bcrypt.genSaltSync()
          );
          return db.User.update(
            {
              passwordHash: bcryptedPassword,
              resetPasswordExpiry: Date.now(),
            },
            { where: { resetPasswordToken: token }, returning: true }
          )
            .then(([, updated]) => {
              if (updated) {
                res.status(200).json({ message: "Password reset complete" });
              }
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }
});

const oneDay = 86400000;
module.exports = router;
