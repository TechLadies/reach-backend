'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Donations', {
      donationId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      donorId: {
        allowNull: false,
        autoIncrement: true,
        foreignKey: true,
        type: Sequelize.INTEGER
      },
      donationDate: {
        type: Sequelize.DATE
      },
      donationAmount: {
        type: Sequelize.NUMERIC
      },
      sourceId:{
        allowNull: false,
        autoIncrement: true,
        foreignKey: false,
        type: Sequelize.INTEGER
      },
      intentId: {
        allowNull: false,
        autoIncrement: false,
        foreignKey: true,
        type: Sequelize.INTEGER
      },
      paymenttypeId: {
        allowNull:false,
        autoIncrement:false,
        foreignKey:true,
        type: Sequelize.INTEGER
      },
      taxDeduction:{
        allowNull:false,  
        type: Sequelize.BOOLEAN
      },
      remarks:{
          allowNull:false,
          type: Sequelize.STRING
      },
      receipt:{
        allowNull:false,
        type: Sequelize.STRING   
      },
      paymentRef:{
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
    return queryInterface.dropTable('Donations');
  }
};
