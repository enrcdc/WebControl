import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Subimos dos niveles para llegar de ./src/config/ a la raíz ./
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// TODO: Añadir modo test y producción

export const config = {
  port: process.env.PORT || 3002,
  database: {
    host:
      process.env.NODE_ENV === "development"
        ? process.env.DEV_DB_HOST
        : process.env.PROD_DB_HOST,
    user:
      process.env.NODE_ENV === "development"
        ? process.env.DEV_DB_USER
        : process.env.PROD_DB_USER,
    port:
      process.env.NODE_ENV === "development"
        ? process.env.DEV_DB_PORT
        : process.env.PROD_DB_PORT,
    password:
      process.env.NODE_ENV === "development"
        ? process.env.DEV_DB_PASSWORD
        : process.env.PROD_DB_PASSWORD,
    name:
      process.env.NODE_ENV === "development"
        ? process.env.DEV_DB_NAME
        : process.env.PROD_DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
  },
};
