'use strict';

module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    text: DataTypes.TEXT
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Article, { foreignKey: 'articleId' });
  };

  return Comment;
};
