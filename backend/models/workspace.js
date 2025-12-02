'use strict';

module.exports = (sequelize, DataTypes) => {
  const Workspace = sequelize.define('Workspace', {
    name: DataTypes.STRING
  });

  Workspace.associate = (models) => {
    Workspace.hasMany(models.Article, { foreignKey: 'workspaceId' });
  };

  return Workspace;
};
