"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Workspaces", [
      {
        name: "Default Workspace",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Workspaces", null, {});
  },
};
