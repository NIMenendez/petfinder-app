import { algoliasearch } from "algoliasearch";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.ALGOLIA_API_KEY || !process.env.ALGOLIA_APP_ID) {
  throw new Error("Las variables de entorno ALGOLIA_API_KEY o ALGOLIA_APP_ID no están definidas");
}

const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;

const client = algoliasearch(ALGOLIA_API_KEY, ALGOLIA_APP_ID);
export { client };