'use strict';
module.exports = (sequelize, DataTypes) => {
  const Sources = sequelize.define('Sources', {
    description: DataTypes.STRING
  }, {});
  Sources.associate = function(models) {
    // associations can be defined here
  };
  return Sources;
};