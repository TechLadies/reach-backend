'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sources = sequelize.define('Sources', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  Sources.associate = function(models) {
    // associations can be defined here
  };
  return Sources;
};