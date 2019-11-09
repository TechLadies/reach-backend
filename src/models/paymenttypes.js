'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentTypes = sequelize.define('PaymentTypes', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  PaymentTypes.associate = function(models) {
    // associations can be defined here
  };
  return PaymentTypes;
};