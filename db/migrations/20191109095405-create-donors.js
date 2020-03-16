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
        unique: true,
        allowNull: true,
        type: Sequelize.STRING
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
      salutationId: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
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
        allowNull: true,
        type: Sequelize.STRING
      },
      address2: {
        allowNull: true,
        type: Sequelize.STRING
      },
      postalCode: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      preferredContactId: {
        allowNull: true,
        foreignkey: true,
        type: Sequelize.INTEGER,
        references: {                 // Add this for foreign key constraints
          model: 'PreferredContacts',
          key: 'id'
        },
        onUpdate: 'cascade'
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