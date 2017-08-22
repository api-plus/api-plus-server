/*
  Projects Model
*/
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Projects', {
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'project name',
    }
  }, {
    tableName: 'projects',
    comment: 'projects for apis',
    indexes: [
      {
        unique: true,
        fields: ['name']
      },
      {
        fields: ['gmt_modified']
      }
    ]
  });
};
