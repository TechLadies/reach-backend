'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Uploads', 
    [
      {
        uploadDate: "2019-12-31",
        firstDate: "2019-01-01",
        lastDate: "2019-01-31",
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      },
      {
        uploadDate: "2019-11-30",
        firstDate: "2019-01-01",
        lastDate: "2019-02-28",
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      },
      {
        uploadDate: "2019-10-30",
        firstDate: "2019-01-01",
        lastDate: "2019-01-01",
        createdAt: Sequelize.literal('NOW()'),
        updatedAt: Sequelize.literal('NOW()')
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Uploads', null, {});
  }
};
