"use strict";

module.exports = (sequelize, DataTypes) => {
  const ArticleVersion = sequelize.define("ArticleVersion", {
    version: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    attachment: DataTypes.STRING
  });

  ArticleVersion.associate = (models) => {
    ArticleVersion.belongsTo(models.Article, {
      foreignKey: "articleId"
    });
  };

  return ArticleVersion;
};
