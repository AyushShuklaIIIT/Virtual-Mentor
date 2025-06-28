const { Pool } = require("pg");

const isProduction = process.env.DB_NODE_ENV === "production";

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        host: "localhost",
        user: "postgres",
        password: "pgsql",
        database: "testing",
        port: 5432,
      }
);

module.exports = pool;