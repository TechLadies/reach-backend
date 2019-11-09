'use strict';
module.exports = (sequelize, DataTypes) => {
  const ContactPersons = sequelize.define('ContactPersons', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  ContactPersons.associate = function(models) {
    // associations can be defined here
  };
  return ContactPersons;
};