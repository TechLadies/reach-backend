'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Uploads', 'uploadDate')
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Uploads', 'uploadDate')
  }
};
