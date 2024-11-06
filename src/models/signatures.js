"use strict";
const { Model } = require("sequelize");
const { Petitions } = require("./petitions");
const { User } = require("./user");
module.exports = (sequelize, DataTypes) => {
  class Signatures extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Signatures.belongsTo(models.Petitions, { foreignKey: "petitionId" });
      Signatures.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Signatures.init(
    {
      petitionId: {
        type: DataTypes.INTEGER,
        references: {
          model: Petitions,
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
      modelName: "Signatures",
    }
  );
  return Signatures;
};
