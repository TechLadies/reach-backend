'use strict';

// const { Donation } = require("../../src/models");

module.exports = (sequelize, DataTypes) => {
  const Donor = sequelize.define('Donor', {
    idNo: DataTypes.INTEGER,
    idTypeId: DataTypes.INTEGER,
    salutationId: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    contactNo: DataTypes.STRING,
    address1: DataTypes.STRING,
    address2: DataTypes.STRING,
    postalCode: DataTypes.INTEGER,
    preferedContactId: DataTypes.INTEGER,
    dnc: DataTypes.BOOLEAN,
    dateofBirth: DataTypes.DATE,
    remarks: DataTypes.STRING,
    contactPersonId: DataTypes.INTEGER
  }, {});

  Donor.associate = function(models) {
    // associations can be defined here
    Donor.hasMany(models.Donation, { 
      foreignKey: 'donorId',
      allowNull: true,
      as: 'donations'
    });

    Donor.hasOne(models.PreferredContact, {
      foreignKey: 'preferredContactId',
      as: 'preferredContact'
    });

    Donor.hasOne(models.Salutation, {
      foreignKey: 'id'
    });

    Donor.hasOne(models.IdType, {
      foreignKey: 'idTypeId',
      as: 'idType'
    });

    Donor.hasOne(models.ContactPerson, {
      foreignKey: 'contactPersonId',
      as: 'contactPerson'
    });

  };

  return Donor;
};