module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Articles", "userId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Users",
        key: "id"
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("Articles", "userId");
  }
};
