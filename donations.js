'use strict';
module.exports = (sequelize, DataTypes) => {
  const Donations = sequelize.define('Donations', {
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
  Donations.associate = function(models) {
    // associations can be defined here
  };
  return Donations;
};