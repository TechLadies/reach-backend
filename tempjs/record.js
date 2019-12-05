"use strict"
module.exports = (sequelize, DataTypes) => {
  const Record = sequelize.define(
    "Record",
    {
      filename: DataTypes.STRING,
      sourceId: DataTypes.INTEGER,
      dateUploaded: DataTypes.DATE,
      uploadedBy: DataTypes.INTEGER
    },
    {}
  )
  Record.associate = function(models) {
    // associations can be defined here
  }
  return Record
}
