'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentType = sequelize.define('PaymentTypes', {
    description: DataTypes.STRING
  }, {});
  PaymentType.associate = function(models) {
    // associations can be defined here
  };
  return PaymentType;
};