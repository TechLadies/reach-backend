'use strict';
module.exports = (sequelize, DataTypes) => {
  const Intent = sequelize.define('Intents', {
    description: DataTypes.STRING
  }, {});
  Intent.associate = function(models) {
    // associations can be defined here
  };
  return Intent;
};