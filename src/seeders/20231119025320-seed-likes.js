"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Likes", [
      {
        postId: 1,
        userId: 2,
      },
      {
        postId: 1,
        userId: 3,
      },
      {
        postId: 2,
        userId: 1,
      },
      {
        postId: 2,
        userId: 2,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Likes", null, {});
  },
};
