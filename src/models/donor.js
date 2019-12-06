'use strict';
module.exports = (sequelize, DataTypes) => {
  const Donor = sequelize.define('Donors', {
    idNo: DataTypes.INTEGER,
    idTypeId: DataTypes.INTEGER,
    salutation: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    contactNo: DataTypes.STRING,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    postalCode: DataTypes.INTEGER,
    preferedContact: DataTypes.STRING,
    dnc: DataTypes.BOOLEAN,
    dateofBirth: DataTypes.DATE,
    remarks: DataTypes.STRING,
    contactPersonId: DataTypes.INTEGER
  }, {});
  Donor.associate = function(models) {
    // associations can be defined here
  };
  return Donor;
};