'use strict'

// const { Donation } = require("../../src/models");

module.exports = (sequelize, DataTypes) => {
  const Donor = sequelize.define(
    'Donor',
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      idNo: { type: DataTypes.STRING, unique: true },
      idTypeId: DataTypes.INTEGER,
      salutationId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      contactNo: DataTypes.STRING,
      address1: DataTypes.STRING,
      address2: DataTypes.STRING,
      postalCode: DataTypes.INTEGER,
      preferredContactId: DataTypes.INTEGER,
      dnc: DataTypes.BOOLEAN,
      dateofBirth: DataTypes.DATE,
      remarks: DataTypes.STRING,
      contactPersonId: DataTypes.INTEGER
    },
    {}
  )

  Donor.associate = function(models) {
    // associations can be defined here
    Donor.hasMany(models.Donation, {
      foreignKey: 'donorId',
      allowNull: true,
      as: 'donations'
    })

    Donor.belongsTo(models.Salutation, {
      as: 'salutation'
    })

    Donor.belongsTo(models.IdType, {
      as: 'idType'
    })

    Donor.belongsTo(models.ContactPerson, {
      as: 'contactPerson'
    })

    Donor.belongsTo(models.PreferredContact, {
      as: 'preferredContact'
    })
  }

  return Donor
}
