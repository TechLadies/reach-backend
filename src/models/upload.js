'use strict';
module.exports = (sequelize, DataTypes) => {
  const upload = sequelize.define('Upload', {
    firstDate: DataTypes.DATE,
    lastDate: DataTypes.DATE
  }, {});
  upload.associate = function(models) {
    // associations can be defined here
  };
  return upload;
};