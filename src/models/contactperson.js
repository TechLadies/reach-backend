'use strict'
module.exports = (sequelize, DataTypes) => {
  const ContactPersons = sequelize.define(
    'ContactPersons',
    { name: DataTypes.STRING },
    { tableName: 'ContactPersons' }
  )
  ContactPersons.associate = function(models) {
    // associations can be defined here
    ContactPersons.hasMany(models.Donor, {
      foreignKey: 'contactPersonId'
    })
  }
  return ContactPersons
}
