"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Comments", [
      {
        postId: 1,
        userId: 2,
        comment: "Ini ada komentar dari postId 1 dan userId 2",
      },
      {
        postId: 2,
        userId: 1,
        comment: "Ini ada komentar dari postId 2 dan userId 1",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Comments", null, {});
  },
};
