'use strict';
module.exports = (sequelize, DataTypes) => {
  const Intents = sequelize.define('Intents', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  Intents.associate = function(models) {
    // associations can be defined here
  };
  return Intents;
};