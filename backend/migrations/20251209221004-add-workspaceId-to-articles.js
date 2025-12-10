"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /*await queryInterface.addColumn("Articles", "workspaceId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Workspaces",
        key: "id"
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL"
    });
    */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Articles", "workspaceId");
  }
};
