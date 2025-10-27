import { Auth } from "../models/auth";
import { User, Pet } from "../models/models";
import { hashPassword } from "../controllers/auth";

export async function getUserById(userId: number) {
  const user = await User.findByPk(userId);
  return user;
}

export async function getUserPets(userId: number) {
  const pets = await Pet.findAll({ where: { userId: userId } });
  return pets;
}

export async function updateUserPassword(userId: number, oldPassword: string, newPassword: string) {
  const authUser = await Auth.findByPk(userId);
  if (authUser && authUser.get("password") === hashPassword(oldPassword)) {
    await authUser.update({ password: hashPassword(newPassword) });
  } else {
    throw new Error("Contraseña antigua incorrecta");
  }
}


export async function updateUserName(userId: number, newName: string) {
  const user = await User.findByPk(userId);
  if (user) {
    await user.update({ name: newName});
  }
}


