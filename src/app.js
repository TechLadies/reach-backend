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
const donorsRouter = require('./routes/donors')
const salutationsRouter = require('./routes/salutations')
const uploadsRouter = require('./routes/uploads')

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

// hard-coding the JSON object for /dashboard
app.post('/api/dashboard', auth.required,
  function(req,res){
    res.json(
      {
        "startDate": "2019-09-23",
        "endDate": "2019-11-23",
        "donationAmt": [{
            "date": "2019-09-23",
            "amount": "213"
          },
          {
            "date": "2019-09-24",
            "amount": "345"
          },
          {
            "date": "2019-09-25",
            "amount": "2343"
          },
          {
            "date": "2019-09-26",
            "amount": "354"
          },
          {
            "date": "2019-09-27",
            "amount": "76"
          },
          {
            "date": "2019-09-28",
            "amount": "6765"
          },
          {
            "date": "2019-09-29",
            "amount": "445"
          },
          {
            "date": "2019-09-30",
            "amount": "97"
          },
          {
            "date": "2019-10-01",
            "amount": "4567"
          },
          {
            "date": "2019-10-02",
            "amount": "458"
          },
          {
            "date": "2019-10-03",
            "amount": "89"
          },
          {
            "date": "2019-10-04",
            "amount": "889"
          }
        ],
        "totalDonationAmt": "12154.00",
        "totalNoOfDonations": "6328",
        "NoOfDonationBySource": [{
            "sourceName": "bi-monthly charity dinner",
            "noOfDonations": 3238
          },
          {
            "sourceName": "church",
            "noOfDonations": 832
          },
          {
            "sourceName": "online (Beverity)",
            "noOfDonations": 290
          },
          {
            "sourceName": "online (REACH)",
            "noOfDonations": 102
          },
          {
            "sourceName": "others",
            "noOfDonations": 88
          }
        ],
        "donationAmtByIntent": [{
            "amount": 4900,
            "intent": "counselling"
          },
          {
            "amount": 5500,
            "intent": "family"
          },
          {
            "amount": 3800,
            "intent": "senior"
          },
          {
            "amount": 4200,
            "intent": "youth"
          }
        ]
      });
  });

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/donors', donorsRouter)
app.use('/donations', donationsRouter)
app.use('/salutations', salutationsRouter)
app.use('/uploads', uploadsRouter)

app.get('*', function (_, res) {
  res.status(404).json({ message: '404 not found' });
});

module.exports = app
