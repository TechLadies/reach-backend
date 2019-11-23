'use strict';
module.exports = (sequelize, DataTypes) => {
  const IdTypes = sequelize.define('IdTypes', {
    description: DataTypes.STRING
  }, {});
  IdTypes.associate = function(models) {
    // associations can be defined here
  };
  return IdTypes;
};