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
      idNo: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      idTypeId:{
          allowNull: false,
          foreignkey: true,
          type: Sequelize.INTEGER,
          references: {                 // Add this for foreign key constraints
            model: 'IdTypes',
            key: 'id'
          },
          onUpdate: 'cascade'
      },
      salutation: {
        type: Sequelize.STRING,
        allowNull: true
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      contactNo: {
        type: Sequelize.STRING,
        allowNull: true
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
      preferedContact: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dnc: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      dateofBirth: {
        allowNull: true,
        type: Sequelize.DATE
      },
      remarks:{
          allowNull: true,
          type: Sequelize.STRING
      },
      contactPersonId:{
          allowNull: true,
          foreignkey: true,
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