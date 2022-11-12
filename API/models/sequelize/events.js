const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('events', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    create_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    start_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('arrangement','reminder','task'),
      allowNull: true
    },
    color: {
      type: DataTypes.CHAR(7),
      allowNull: true,
      defaultValue: "_cp866\\'#8a2be2\\'"
    }
  }, {
    sequelize,
    tableName: 'events',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "author_id",
        using: "BTREE",
        fields: [
          { name: "author_id" },
        ]
      },
    ]
  });
};
