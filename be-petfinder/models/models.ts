import { User } from "./user";
import { Pet } from "./pet";
import { Report } from "./report";

User.hasMany(Pet, { foreignKey: "userId" });
Pet.hasMany(Report, { foreignKey: "petId" });
Pet.belongsTo(User, { foreignKey: "userId" });


export { User, Pet, Report }