import { Model, DataTypes } from "sequelize"
import sequelize from "./connection/connection.js"

export class Auth extends Model {}

Auth.init({
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: "Auth"
});
