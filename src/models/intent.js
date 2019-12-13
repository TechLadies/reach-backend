'use strict';
module.exports = (sequelize, DataTypes) => {
  const Intent = sequelize.define('Intent', {
    description: DataTypes.STRING
  }, {});
  Intent.associate = function(models) {
    // associations can be defined here
    Intent.hasMany(models.Donation, {
      foreignKey: 'intentId',
      as: 'donations'
    })
  };
  return Intent;
};