"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Signatures", [
      {
        petitionId: 2,
        userId: 2,
      },
      {
        petitionId: 1,
        userId: 3,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Signatures", null, {});
  },
};
