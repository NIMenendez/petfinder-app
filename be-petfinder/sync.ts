import sequelize from "./models/connection/connection"
import {User, Pet, Report} from "./models/models"

async function syncDatabase() {
  await sequelize.sync({force: true});

  await User.findAll();
  await Pet.findAll();
  await Report.findAll();

  console.log("Base de datos sincronizada");
}
syncDatabase();