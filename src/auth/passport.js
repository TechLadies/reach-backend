const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { User } = require("../models");
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.EXPRESS_SESSION_SECRET,
};

passport.use('local',
  new LocalStrategy(async (username, password, done) => {
    let user = await User.findOne({ where: { username: username } });

    // if user doesnt exist
    if (!user) {
      return done(null, false, { message: "User not found." });
    }

    // authentication
    user.validatePassword(password, user, done);
  })
);

passport.use('jwtauth',
  new JwtStrategy(jwtOptions, async function ({ userId }, done) {
    // If no id, just return and let the authenticate middleware deal
    // with response
    if (!userId) {
      return done(null, null);
    }

    // Deserialise logic from token
    const user = await User.findByPk(userId);
    if (user) {
      return done(null, user);
    } else {
      return done({ error: 'User not found.' }, null);
    }
  })
);

module.exports = passport;
