"use strict";
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      username: DataTypes.STRING,
      passwordHash: DataTypes.STRING,
      userRoleId: DataTypes.INTEGER
    },
    {
      hooks: {
        beforeCreate: user => {
          const salt = bcrypt.genSaltSync();
          user.passwordHash = bcrypt.hashSync(user.passwordHash, salt);
        }
      }
    }
  );
  User.associate = function(models) {
    // associations can be defined here
  };

  User.prototype.validatePassword = (password, user, done) => {
    bcrypt.compare(password, user.passwordHash, (err, isValid) => {
      //error handling
      if (err) {
        console.error(err);
        return done(err);
      }

      //if password is invalid
      if (!isValid) {
        return done(null, false, { message: "Incorrect password." });
      } else {
        return done(null, user);
      }
    });
  };

  return User;
};

