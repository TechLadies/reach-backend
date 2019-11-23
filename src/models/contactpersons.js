'use strict';
module.exports = (sequelize, DataTypes) => {
  const ContactPersons = sequelize.define('ContactPersons', {
    salutation: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING
  }, {});
  ContactPersons.associate = function(models) {
    // associations can be defined here
  };
  return ContactPersons;
};