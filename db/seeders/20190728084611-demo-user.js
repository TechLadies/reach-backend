'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      firstName: 'Admin',
      lastName: 'Tan',
      email: 'admin@techladies.co',
      passwordHash: 'password',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {validate: true, 
      individualHooks: true});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
