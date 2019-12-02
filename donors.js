'use strict';
module.exports = (sequelize, DataTypes) => {
  const Donors = sequelize.define('Donors', {
    salutations: DataTypes.STRING,
    IdType: DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    contact: DataTypes.STRING,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    postalCode: DataTypes.INTEGER,
    preferredContact: DataTypes.STRING,
    dnc: DataTypes.BOOLEAN,
    dateOfBirth: DataTypes.DATE,
    remarks: DataTypes.STRING,
    contactPersonId: DataTypes.INTEGER
  }, {});
  Donors.associate = function(models) {
    // associations can be defined here
  };
  return Donors;
};