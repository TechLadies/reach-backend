'use strict';
module.exports = (sequelize, DataTypes) => {
  const CharityUser = sequelize.define('CharityUser', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  CharityUser.associate = function(models) {
    // associations can be defined here
  };
  return CharityUser;
};