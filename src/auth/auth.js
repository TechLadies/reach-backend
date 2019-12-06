'use strict';

const path = require('path');
const passport = require(path.resolve('src/auth/passport'));
const jwt = require('jsonwebtoken');

// login drives the workflow for a login strategy to be used and ensures
// that a valid token is returned in the response
exports.login = function (req, res, next) {
    passport.authenticate('local', { session: false }, function (err, user) {
      if (err) {
        return res.status(500).json({ message: `500 ${err.message}` });
      }
      if (!user) {
        return res.status(401).json({ message: '401 credentials are invalid' });
      }
  
      // Replacement for serialising the returned token
      const token = jwt.sign({ userId: user.id }, process.env.EXPRESS_SESSION_SECRET);
      res.json({ token });
    })(req, res, next);
  };

  exports.required = function (req, res, next) {
    passport.authenticate('jwtauth', { session: false }, function (err, user) {
      if (err) {
        return res.status(500).json({ message: `500 ${err.message}` });
      }
      if (!user) {
        return res.status(403).json({ message: '403 forbidden' });
      }
  
      // User is found - embed user and proceed
      req.user = user;
      next()
    })(req, res, next);
  };
  
  exports.optional = function (req, res, next) {
    passport.authenticate('jwtauth', { session: false }, function (err, user) {
      if (err) {
        return res.status(500).json({ message: `500 ${err.message}` });
      }
      if (user) {
        // User is found - embed user
        req.user = user;
      }
  
      // User is not necessary in optional, we proceed
      next()
    })(req, res, next);
  };