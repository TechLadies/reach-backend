'use strict';
module.exports = (sequelize, DataTypes) => {
  const Intents = sequelize.define('Intents', {
    description: DataTypes.STRING
  }, {});
  Intents.associate = function(models) {
    // associations can be defined here
  };
  return Intents;
};