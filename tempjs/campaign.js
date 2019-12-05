'use strict'
module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define(
    'Campaign',
    {
      type: DataTypes.STRING,
      dateStart: DataTypes.DATE,
      dateEnd: DataTypes.DATE
    },
    {}
  )
  Campaign.associate = function (models) {
    // associations can be defined here
  }
  return Campaign
}
