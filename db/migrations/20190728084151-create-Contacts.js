'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Contacts', {
      contactpersonId: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      contactperson1Name:{
          allowNull:false,
          type: Sequelize.STRING
      },
      contactperson2Name:{
          allowNull:false,
          type: Sequelize.STRING
      },
      salutation:{
          allowNull:false,
          type: Sequelize.STRING
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
    return queryInterface.dropTable('Contacts');
  }
};