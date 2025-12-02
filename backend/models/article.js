'use strict';

module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    attachment: DataTypes.STRING
  });

  Article.associate = (models) => {
    Article.belongsTo(models.Workspace, { foreignKey: 'workspaceId' });
    Article.hasMany(models.Comment, { foreignKey: 'articleId' });
  };

  return Article;
};
