'use strict';
module.exports = (sequelize, DataTypes) => {
  const ContactPerson = sequelize.define('ContactPerson', {
    salutation: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING
  }, {});
  ContactPerson.associate = function(models) {
    // associations can be defined here
  };
  return ContactPerson;
};