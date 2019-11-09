'use strict';
module.exports = (sequelize, DataTypes) => {
  const Donations = sequelize.define('Donations', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  Donations.associate = function(models) {
    // associations can be defined here
  };
  return Donations;
};