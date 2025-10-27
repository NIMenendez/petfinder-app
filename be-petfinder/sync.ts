import sequelize from "./models/connection/connection"
import {User, Pet, Report} from "./models/models"
import { Auth } from "./models/auth";

async function syncDatabase() {
  await sequelize.sync({alter: true});

  await User.findAll();
  await Pet.findAll();
  await Report.findAll();
  await Auth.findAll();

  console.log("Base de datos sincronizada");
}
syncDatabase();