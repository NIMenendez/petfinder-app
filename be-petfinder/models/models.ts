import { User } from "./user.js";
import { Pet } from "./pet.js";
import { Report } from "./report.js";

User.hasMany(Pet, { foreignKey: "userId" });
Pet.hasMany(Report, { foreignKey: "petId" });
Pet.belongsTo(User, { foreignKey: "userId" });


export { User, Pet, Report }