const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    login: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: "login"
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(60),
      allowNull: false,
      defaultValue: "unconfirmed"
    },
    profile_picture: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "profile_pictures\/default.png"
    }
  }, {
    sequelize,
    tableName: 'users',
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
        name: "login",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "login" },
        ]
      },
    ]
  });
};
