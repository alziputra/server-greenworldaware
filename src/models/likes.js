"use strict";
const { Model } = require("sequelize");
const { User } = require("./user");
const { Post } = require("./post");
module.exports = (sequelize, DataTypes) => {
  class Likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Likes.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Likes.init(
    {
      postId: {
        type: DataTypes.INTEGER,
        references: {
          model: Post,
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: User,
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Likes",
    }
  );
  return Likes;
};
