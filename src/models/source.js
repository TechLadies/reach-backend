'use strict';
module.exports = (sequelize, DataTypes) => {
  const Source = sequelize.define('Source', {
    description: DataTypes.STRING
  }, {});
  Source.associate = function(models) {
    // associations can be defined here
    Source.hasMany(models.Donation, {
      foreignKey: 'sourceId',
      as: 'donations'
    })
  };
  return Source;
};