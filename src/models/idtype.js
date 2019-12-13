'use strict';
module.exports = (sequelize, DataTypes) => {
  const IdType = sequelize.define('IdType', {
    description: DataTypes.STRING
  }, {});
  IdType.associate = function(models) {
    // associations can be defined here
  };
  return IdType;
};