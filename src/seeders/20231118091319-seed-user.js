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
    await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "Hamzah",
          lastName: "Raihan",
          email: "hamzah@gmail.com",
          password: "admin",
          gender: "laki-laki",
        },
        {
          firstName: "Alzi ",
          lastName: "Rahmana",
          email: "alzi@gmail.com",
          password: "admin",
          gender: "laki-laki",
        },
        {
          firstName: "Irfan ",
          lastName: "Hananto",
          email: "irfan@gmail.com",
          password: "admin",
          gender: "laki-laki",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Users", null, {});
  },
};
