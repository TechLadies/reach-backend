'use strict';
module.exports = (sequelize, DataTypes) => {
  const PreferredContact = sequelize.define('PreferredContact', {
    description: DataTypes.STRING
  }, {});
  PreferredContact.associate = function(models) {
    // associations can be defined here
    PreferredContact.hasMany(models.Donor, {
      foreignKey: 'preferredContactId',
      as: 'donors'
    })
  };
  return PreferredContact;
};