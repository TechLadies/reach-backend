'use strict';

const { User } = require("../../src/models");

const users = [
  {
    firstName: 'Admin',
    lastName: 'Tan',
    email: 'admin@techladies.co',
    passwordHash: 'password',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

module.exports = {
  up: (queryInterface, Sequelize) => {
    return User.bulkCreate(users, {
      individualHooks: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Users", null, {});
  }
};
