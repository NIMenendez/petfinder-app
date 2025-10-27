import { Model, DataTypes } from "sequelize"
import sequelize from "./connection/connection"

export class Report extends Model {}

Report.init({
  reporterPhone: {type: DataTypes.STRING},
  petId: {type: DataTypes.INTEGER},
  description: {type: DataTypes.TEXT},
  timestamp: {type: DataTypes.DATE},
  reporterName: {type: DataTypes.STRING}
}, {
  sequelize,
  modelName: "report"
});
