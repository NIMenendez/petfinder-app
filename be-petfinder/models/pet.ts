import { Model, DataTypes } from "sequelize"
import sequelize from "./connection/connection"


export class Pet extends Model {}

Pet.init({
  name: {type: DataTypes.STRING},
  status_lost: {type: DataTypes.BOOLEAN},
  lat: {type: DataTypes.FLOAT},
  lng: {type: DataTypes.FLOAT},
  imageUrl: {type: DataTypes.STRING},
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  sequelize,
  modelName: "pet"
});
