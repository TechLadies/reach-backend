'use strict';
module.exports = (sequelize, DataTypes) => {
  const Donors = sequelize.define('Donors', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  Donors.associate = function(models) {
    // associations can be defined here
  };
  return Donors;
};