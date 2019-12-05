'use strict';
module.exports = (sequelize, DataTypes) => {
  const DonorFrequency = sequelize.define('DonorFrequency', {
    donorFrequency: DataTypes.STRING
  }, {});
  DonorFrequency.associate = function(models) {
    // associations can be defined here
  };
  return DonorFrequency;
};