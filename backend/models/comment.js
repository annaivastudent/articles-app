'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.Article, { foreignKey: 'articleId' });
  };

  return Comment;
};
