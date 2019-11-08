'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

      return queryInterface.bulkInsert('IdTypes', 
        [
          {
            name: 'NRIC',
            createdAt: Sequelize.literal('NOW()'),
            updatedAt: Sequelize.literal('NOW()')
          },
          {
            name: 'FIN',
            createdAt: Sequelize.literal('NOW()'),
            updatedAt: Sequelize.literal('NOW()')
          },
          {
            NAME: 'UEN-LOCAL COMPANY',
            createdAt: Sequelize.literal('NOW()'),
            updatedAt: Sequelize.literal('NOW()')
          },
          {
            NAME: 'UEN-BUSINESS',
            createdAt: Sequelize.literal('NOW()'),
            updatedAt: Sequelize.literal('NOW()')
          },
          {
            NAME: 'UEN-OTHERS',
            createdAt: Sequelize.literal('NOW()'),
            updatedAt: Sequelize.literal('NOW()')
          },
          {
            NAME: 'OTHERS',
            createdAt: Sequelize.literal('NOW()'),
            updatedAt: Sequelize.literal('NOW()')
          }
        ]);
    
 
    await queryInterface.bulkInsert('UserRoles', [{
      id: adminRoleId,
      name: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: '2',
      name: 'staff',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {}).then(() => {
      return queryInterface.bulkInsert('Users', [{
        name: 'John Smith',
        username: 'john@smith.com',
        passwordSalt: '',
        passwordHash: '',
        userRoleId: adminRoleId,
        weight: 62.57,
        createdAt: new Date(),
        updatedAt: new Date()
      }], {});
    })
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
