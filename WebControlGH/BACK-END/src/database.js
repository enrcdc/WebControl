import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: "sldk368.piensasolutions.com",
  user: "qaic837",
  port: 3306,
  password: "Abaco2023.",
  database: "qaic837",
});

export default db;
