'use strict';
module.exports = (sequelize, DataTypes) => {
  const DonorType = sequelize.define('DonorType', {
    donorType: DataTypes.STRING
  }, {});
  DonorType.associate = function(models) {
    // associations can be defined here
  };
  return DonorType;
};