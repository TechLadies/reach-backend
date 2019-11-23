'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentTypes = sequelize.define('PaymentTypes', {
    description: DataTypes.STRING
  }, {});
  PaymentTypes.associate = function(models) {
    // associations can be defined here
  };
  return PaymentTypes;
};