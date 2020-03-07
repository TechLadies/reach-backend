'use strict'
module.exports = (sequelize, DataTypes) => {
  const ContactPerson = sequelize.define(
    'ContactPerson',
    { name: DataTypes.STRING },
    { tableName: 'ContactPersons' }
  )
  ContactPerson.associate = function(models) {
    // associations can be defined here
    ContactPerson.hasMany(models.Donor, {
      foreignKey: 'contactPersonId'
    })
  }
  return ContactPerson
}
