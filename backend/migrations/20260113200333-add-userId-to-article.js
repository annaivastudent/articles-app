module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Articles", "userId", {
      type: Sequelize.INTEGER,
      allowNull: true, // разрешаем null, чтобы не падало на старых данных
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
