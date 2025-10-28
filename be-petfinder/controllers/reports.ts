import { Pet, Report, User } from "../models/models";
import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
const RESEND_API_KEY = process.env.RESEND_API_KEY as string;

export async function reportPetSighting(petId: number, reporterPhone: number, reporterName: string, description: string) {
  const report = await Report.create({ petId, reporterPhone, reporterName, description, timestamp: new Date() });
  return report;
}

export async function sendEmailNotification(petId: number, reporterPhone: number, reporterName: string, description: string) {
  
  const pet = await Pet.findByPk(petId);
  const petOwnerId = pet ? pet.get("userId") : null;
  async function getUserEmail(userId: number) {
    const user = await User.findByPk(userId);
    return user ? user.get("email") : null;
  }

  const petName = pet ? pet.get("name") : "tu mascota"; 

  if (petOwnerId) {
    const resend = new Resend(RESEND_API_KEY);
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: await getUserEmail(petOwnerId as number) as string,
      subject: `Alguien ha reportado un avistamiento de ${petName}`,
      html: `<h1>Reporte de Avistamiento</h1>
             <h3>Hola, tenemos buenas noticias!</h3>
             <p>Alguien ha reportado un avistamiento de <strong>${petName}</strong>.</p>
             <p><strong>Detalles del reporte:</strong></p>
             <ul>
               <li><strong>Nombre del reportero:</strong> ${reporterName}</li>
               <li><strong>Teléfono del reportero:</strong> ${reporterPhone}</li>
               <li><strong>Descripción:</strong> ${description}</li>
             </ul>
             <p>Por favor, contacta al reportero para más información.</p>
             <p>¡Esperamos que esta información te ayude a encontrar a tu mascota pronto!</p>`,
    });
  }
  return;
}

