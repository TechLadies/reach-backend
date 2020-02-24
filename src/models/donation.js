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

    Donation.belongsTo(models.Source, {
      foreignKey: 'sourceId'
    });

    Donation.belongsTo(models.PaymentType, {
      foreignKey: 'id'
    });

    Donation.belongsTo(models.Intent, {
      foreignKey: 'intentId',
      as: 'intent'
    });
  };
  return Donation;
};