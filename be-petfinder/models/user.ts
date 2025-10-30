import { Model, DataTypes } from "sequelize"
import sequelize from "./connection/connection.js"

export class User extends Model {}

User.init({
  name: {type: DataTypes.STRING},
  email: {type: DataTypes.STRING},
}, {
  sequelize,
  modelName: "user"
});
