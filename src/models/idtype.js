'use strict';
module.exports = (sequelize, DataTypes) => {
  const IdType = sequelize.define('IdTypes', {
    description: DataTypes.STRING
  }, {});
  IdType.associate = function(models) {
    // associations can be defined here
  };
  return IdType;
};