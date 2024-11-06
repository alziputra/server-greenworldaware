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
    await queryInterface.bulkInsert("Petitions", [
      {
        userId: 1,
        title: "Petisi pertama",
        description: "Ini deskripsi petisi pertama",
        image: "",
      },
      {
        userId: 2,
        title: "Petisi pertama",
        description: "Ini deskripsi petisi pertama",
        image: "",
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
    await queryInterface.bulkDelete("Petitions", null, {});
  },
};
