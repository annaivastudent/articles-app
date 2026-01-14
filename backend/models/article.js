"use strict";

module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define("Article", {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    attachment: DataTypes.STRING,

    // workspaceId — как у тебя
    workspaceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Workspaces",
        key: "id"
      }
    },

    // 🔥 ДОБАВЛЯЕМ userId
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id"
      }
    }
  }, {
    // 🔥 ВКЛЮЧАЕМ createdAt / updatedAt
    timestamps: true
  });

  Article.associate = (models) => {
    Article.belongsTo(models.Workspace, {
      foreignKey: "workspaceId"
    });

    Article.belongsTo(models.User, {
      foreignKey: "userId"
    });

    Article.hasMany(models.Comment, {
      foreignKey: "articleId",
      as: "comments"
    });

    Article.hasMany(models.ArticleVersion, {
      foreignKey: "articleId",
      as: "versions"
    });
  };

  return Article;
};
