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
    await queryInterface.bulkInsert("News", [
      {
        title: "Ini adalah berita pertama",
        description: "ini deskripsi dari berita pertama",
        image: "",
        userId: 2,
        categoryId: 1,
      },
      {
        title: "Ini adalah berita kedua",
        description: "ini deskripsi dari berita kedua",
        image: "",
        userId: 1,
        categoryId: 2,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("News", null, {});
  },
};
