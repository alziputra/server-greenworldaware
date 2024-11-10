"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, { foreignKey: "userId" });
      User.hasMany(models.Likes, { foreignKey: "userId" });
      User.hasMany(models.Comments, { foreignKey: "userId" });
      User.hasMany(models.Signatures, { foreignKey: "userId" });
      User.hasMany(models.News, { foreignKey: "userId" });
      User.hasMany(models.Petitions, { foreignKey: "userId" });
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      image: DataTypes.STRING,
      points: DataTypes.INTEGER,
      gender: {
        type: DataTypes.ENUM,
        values: ["laki-laki", "perempuan"],
      },
      role: {
        type: DataTypes.ENUM,
        values: ["super admin", "admin", "user"],
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: new Date(),
      },
    },
    {
      sequelize,
      timestamps: true,
      modelName: "User",
    }
  );

  return User;
};
