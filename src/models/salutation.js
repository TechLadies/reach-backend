'use strict';

module.exports = (sequelize, DataTypes) => {
  const Salutation = sequelize.define('Salutation', {
    description: DataTypes.STRING
  }, {});
  Salutation.associate = function(models) {
    // associations can be defined here
    Salutation.hasMany(models.Donor, {
      foreignKey: 'salutationId',
      as: 'donors'
    })
  };
  return Salutation;
};