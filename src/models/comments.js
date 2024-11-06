"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Comments extends Model {
    static associate(models) {
      // Define associations here
      Comments.belongsTo(models.User, { foreignKey: "userId" });
      Comments.belongsTo(models.Post, { foreignKey: "postId" });
    }
  }
  Comments.init(
    {
      postId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Posts",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      comment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Comments",
    }
  );
  return Comments;
};
