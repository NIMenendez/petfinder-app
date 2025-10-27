import { Pet, Report } from "../models/models";

export async function reportPetSighting(petId: number, reporterPhone: number, reporterName: string, description: string) {
  const report = await Report.create({ petId, reporterPhone, reporterName, description, timestamp: new Date() });
  return report;
}