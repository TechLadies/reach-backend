'use strict';

module.exports = (sequelize, DataTypes) => {
  const Salutation = sequelize.define('Salutation', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: DataTypes.STRING
  }, {});
  Salutation.associate = function(models) {
    // associations can be defined here
    Salutation.hasMany(models.Donor, {
      foreignKey: 'salutationId',
      as: 'salutation'
    })
  };
  return Salutation;
};