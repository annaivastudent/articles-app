module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ArticleVersions", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      articleId: {
  type: Sequelize.INTEGER,
  references: {
    model: "Articles",
    key: "id"
  },
  onDelete: "CASCADE"
},

      version: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      title: Sequelize.STRING,
      content: Sequelize.TEXT,
      attachment: Sequelize.STRING,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("ArticleVersions");
  }
};
