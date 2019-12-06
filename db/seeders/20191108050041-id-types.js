'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('IdTypes', 
        [
          {
            description: 'NRIC',
            createdAt: Sequelize.literal('NOW()'),
            updatedAt: Sequelize.literal('NOW()')
          },
          {
            description: 'FIN',
            createdAt: Sequelize.literal('NOW()'),
            updatedAt: Sequelize.literal('NOW()')
          },
          {
            description: 'UEN-LOCAL COMPANY',
            createdAt: Sequelize.literal('NOW()'),
            updatedAt: Sequelize.literal('NOW()')
          },
          {
            description: 'UEN-BUSINESS',
            createdAt: Sequelize.literal('NOW()'),
            updatedAt: Sequelize.literal('NOW()')
          },
          {
            description: 'UEN-OTHERS',
            createdAt: Sequelize.literal('NOW()'),
            updatedAt: Sequelize.literal('NOW()')
          },
          {
            description: 'OTHERS',
            createdAt: Sequelize.literal('NOW()'),
            updatedAt: Sequelize.literal('NOW()')
          }
        ]);

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
