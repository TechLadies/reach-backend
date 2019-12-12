"use strict";

const fs = require("fs");
const path = require("path");
let rawdata = fs.readFileSync(path.resolve(__dirname, "../MOCK_DONATIONS_DATA.json"));
let donors = JSON.parse(rawdata);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert("Donations", donors);
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete("Donations", null, {});
  }
};
