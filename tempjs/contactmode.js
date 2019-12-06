'use strict'
module.exports = (sequelize, DataTypes) => {
  const ContactMode = sequelize.define(
    'ContactMode',
    {
      contactMode: DataTypes.STRING
    },
    {}
  )
  ContactMode.associate = function (models) {
    // associations can be defined here
  }
  return ContactMode
}
