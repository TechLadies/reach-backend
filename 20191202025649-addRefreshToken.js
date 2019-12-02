'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.addColumn(
      'Donors',
      'idNo',
     Sequelize.INTEGER
    );
  },

  //down: (queryInterface, Sequelize) => {
    down: function(queryInterface, Sequelize) {
      // down function will revert the changes in case we need to roll back
      return queryInterface.removeColumn(
        'Donors',
        'idNo'
      );

  },
      
}

