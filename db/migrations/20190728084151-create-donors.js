'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Donors', {
      donorId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      donoridNumber: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idType:{
          allowNull:false,
          autoIncrement:false,
          foreignkey:true,
          type: Sequelize.INTEGER
      },
      salutation: {
        type: Sequelize.STRING
      },
      firstName: {
        type: Sequelize.STRING
      },
      lastName: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      contact: {
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
      prefferedContact: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dnc: {
        type: Sequelize.BOOLEAN
      },
      dateofBirth: {
        allowNull: false,
        type: Sequelize.DATE
      },
      remarks:{
          allowNull: false,
          type: Sequelize.STRING
      },
      contactpersonId:{
          allowNull: false,
          foreignkey: true,
          type: Sequelize.INTEGER
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
