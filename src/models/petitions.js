"use strict";
const { Model } = require("sequelize");
const { User } = require("./user");
module.exports = (sequelize, DataTypes) => {
  class Petitions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Petitions.belongsTo(models.User, { foreignKey: "userId" });
      Petitions.hasMany(models.Signatures, { foreignKey: "petitionId" });
    }
  }
  Petitions.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: User,
          key: "id",
        },
      },
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Petitions",
    }
  );
  return Petitions;
};
