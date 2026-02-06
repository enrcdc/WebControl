import mysql from "mysql2/promise";
import { config } from "./env.js";

export const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  port: config.database.port,
  password: config.database.password,
  database: config.database.name,
});
