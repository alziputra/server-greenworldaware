"use strict";
const { Model } = require("sequelize");
const { Categories } = require("./categories");
const { User } = require("./user");
module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      News.belongsTo(models.Categories, { foreignKey: "categoryId" });
      News.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  News.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
      userId: {
        type: DataTypes.STRING,
        references: {
          model: User,
          key: "id",
        },
      },
      categoryId: {
        type: DataTypes.STRING,
        references: {
          model: Categories,
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "News",
    }
  );
  return News;
};
