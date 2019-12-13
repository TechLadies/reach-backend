require('dotenv').config()

const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const passport = require("../src/auth/passport");
const auth = require(path.resolve('src/auth/auth'));
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const donationsRouter = require('./routes/donations')

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(passport.initialize());

app.post('/login', auth.login);

app.get('/test-required', auth.required, function(req, res){
  const user = req.user || {};
  res.json({ id: user.id, username: user.username });
});

app.get('/test-optional', auth.optional, function(req, res){
  const user = req.user || {};
  res.json({ id: user.id, username: user.username });
});

app.use('/donations', auth.required, donationsRouter)

app.use('/', indexRouter)
app.use('/users', usersRouter)

app.get('*', function (_, res) {
  res.status(404).json({ message: '404 not found' });
});

module.exports = app
