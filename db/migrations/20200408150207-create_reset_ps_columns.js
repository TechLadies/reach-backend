'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Users',
        'resetPasswordToken',
        Sequelize.STRING
      ),
      queryInterface.addColumn(
        'Users',
        'resetPasswordExpiry',
        Sequelize.STRING
      )
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('Users', 'resetPasswordToken'),
      queryInterface.removeColumn('Users', 'resetPasswordExpiry')
    ])
  }
}
