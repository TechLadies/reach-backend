'use strict';
module.exports = (sequelize, DataTypes) => {
  const Source = sequelize.define('Sources', {
    description: DataTypes.STRING
  }, {});
  Source.associate = function(models) {
    // associations can be defined here
  };
  return Source;
};