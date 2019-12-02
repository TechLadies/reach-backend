'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Donors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      salutations: {
        allowNull: true,
        type: Sequelize.STRING
      },
      IdType: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING
      },
      contact: {
        allowNull: true,
        type: Sequelize.STRING
      },
      address1: {
        allowNull: false,
        type: Sequelize.STRING
      },
      address2: {
        allowNull: false,
        type: Sequelize.STRING
      },
      postalCode: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      preferredContact: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dnc: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      dateOfBirth: {
        allowNull: true,
        type: Sequelize.DATE
      },
      remarks: {
        allowNull: true,
        type: Sequelize.STRING
      },
      contactPersonId: {
        allowNull: false,
        foreignKey:true,
        type: Sequelize.INTEGER,
        references: {                 // Add this for foreign key constraints
          model: 'ContactPersons',
          key: 'id'
        },
        onUpdate: 'cascade'
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
    return queryInterface.dropTable('Donors');
  }
};