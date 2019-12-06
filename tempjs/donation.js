'use strict'
module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define(
    'Donation',
    {
      amount: DataTypes.INTEGER,
      campaignId: DataTypes.INTEGER,
      sourceId: DataTypes.INTEGER,
      donationDate: DataTypes.DATE,
      donorId: DataTypes.INTEGER
    },
    {}
  )
  Donation.associate = function (models) {
    // associations can be defined here
  }
  return Donation
}
