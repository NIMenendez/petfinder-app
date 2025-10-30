import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from 'url';

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde la raíz del proyecto (3 niveles arriba)
const envPath = path.join(__dirname, '../../../.env');
dotenv.config({ path: envPath });

// Verifica que la variable de entorno exista
if (!process.env.PROD_DATABASE_URL) {
  throw new Error("La variable de entorno PROD_DATABASE_URL no está definida");
}

const sequelize = new Sequelize(process.env.PROD_DATABASE_URL);

export default sequelize;
