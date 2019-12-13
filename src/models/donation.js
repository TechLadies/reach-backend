'use strict';

// const { Donor } = require("../../src/models");

module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define('Donation', {
    donorId: DataTypes.INTEGER,
    donationDate: DataTypes.DATE,
    donationAmount: DataTypes.NUMERIC,
    sourceId: DataTypes.INTEGER,
    intentId: DataTypes.INTEGER,
    paymentTypeId: DataTypes.INTEGER,
    donationType: DataTypes.STRING,
    paymentRef: DataTypes.STRING,
    taxDeductible: DataTypes.BOOLEAN,
    remarks: DataTypes.STRING,
    receiptNo: DataTypes.STRING,
    void: DataTypes.BOOLEAN
  }, {});
  Donation.associate = function(models) {
    // associations can be defined here
    Donation.belongsTo(models.Donor, {
      foreignKey: 'donorId',
      as: 'donor'
    });

    Donation.hasOne(models.Source, {
      foreignKey: 'sourceId',
      as: 'source'
    });

    Donation.hasOne(models.PaymentType, {
      foreignKey: 'paymentTypeId',
      as: 'paymentType'
    });

    Donation.hasOne(models.Intent, {
      foreignKey: 'intentId',
      as: 'intent'
    });
  };
  return Donation;
};