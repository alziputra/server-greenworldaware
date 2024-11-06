"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      // Define associations here
      Post.belongsTo(models.User, { foreignKey: "userId" });
      Post.hasMany(models.Likes, { foreignKey: "postId" });
      Post.hasMany(models.Comments, { foreignKey: "postId" });
    }
  }
  Post.init(
    {
      post: DataTypes.STRING,
      image: DataTypes.STRING,
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Post",
    }
  );

  return Post;
};
