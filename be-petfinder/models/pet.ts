import { Model, DataTypes } from "sequelize"
import sequelize from "./connection/connection"

export class Pet extends Model {}

Pet.init({
  name: {type: DataTypes.STRING},
  status_lost: {type: DataTypes.BOOLEAN},
  location: {type: DataTypes.STRING},
  description: {type: DataTypes.TEXT},
  imageUrl: {type: DataTypes.STRING},
  reporterId: {type: DataTypes.INTEGER}
}, {
  sequelize,
  modelName: "pet"
});
