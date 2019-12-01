require("dotenv").config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const session = require('express-session');
const passport = require("../src/auth/passport.js");
const auth = require("../src/auth/auth.js");
const app = express();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
)

 app.get('/login',(req, res, next)=>{
   res.json({
      message : " Hey I am from get-login request"
   })
});

app.use('/', indexRouter)
app.use('/users', usersRouter)

module.exports = app
