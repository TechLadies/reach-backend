'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('uploads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uploadDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      firstDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      lastDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
          allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('uploads');
  }
};