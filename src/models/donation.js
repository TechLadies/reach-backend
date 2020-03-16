'use strict';

// const { Donor } = require("../../src/models");

module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define('Donation', {
    donorId: DataTypes.INTEGER,
    donationDate: DataTypes.DATE,
    donationAmount: DataTypes.DECIMAL,
    sourceId: DataTypes.INTEGER,
    intentId: DataTypes.INTEGER,
    paymentTypeId: DataTypes.INTEGER,
    donationType: DataTypes.STRING,
    paymentRef: DataTypes.STRING,
    taxDeductible: DataTypes.BOOLEAN,
    remarks: DataTypes.STRING,
    receiptNo: { type: DataTypes.STRING, unique: true },
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
      foreignKey: 'paymentTypeId'
    });

  };
  return Donation;
};