import knex from "knex";
import mysql from "mysql2/promise";
import { config } from "./env.js";

// Instancia de Knex (query builder) — usar en modelos migrados
export const db = knex({
  client: "mysql2",
  connection: {
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
  },
});

// Pool legacy (mysql2/promise) — mantener mientras haya modelos sin migrar
// TODO: Eliminar cuando todos los modelos usen Knex
export const pool = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  port: config.database.port,
  password: config.database.password,
  database: config.database.name,
});
