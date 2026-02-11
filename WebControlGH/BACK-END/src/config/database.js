import knex from "knex";
import { config } from "./env.js";

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
