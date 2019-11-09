'use strict';
module.exports = (sequelize, DataTypes) => {
  const IdTypes = sequelize.define('IdTypes', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  IdTypes.associate = function(models) {
    // associations can be defined here
  };
  return IdTypes;
};