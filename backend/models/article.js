"use strict";

module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define("Article", {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    attachment: DataTypes.STRING,
    workspaceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Workspaces",
        key: "id"
      }
    }
  });

  Article.associate = (models) => {
    // связь с Workspace
    Article.belongsTo(models.Workspace, {
      foreignKey: "workspaceId"
    });

    // связь с комментариями
    Article.hasMany(models.Comment, {
      foreignKey: "articleId",
      as: "comments"
    });

    // связь с версиями
    Article.hasMany(models.ArticleVersion, {
      foreignKey: "articleId",
      as: "versions"
    });
  };

  return Article;
};
