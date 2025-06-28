const db = require("../dbConnection");

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(200)
  );
`;

async function createUsersTable() {
  try {
    await db.query(createTableQuery);
    console.log("Users table created...");
  } catch (err) {
    console.error("Error creating users table:", err);
  }
}


async function insertUserIntoDb(user) {
  const result = await db.query(
    "INSERT INTO users(username, email, password) VALUES ($1, $2, $3) RETURNING id",
    [user.username, user.email, user.password]
  );
  console.log("Insert result:", result.rows[0]);
  return result.rows[0].id;
}

async function getUserFromDbByEmail(email) {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
}

async function getUserFromDbByUserID(userID) {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [userID]);
  return result.rows[0];
}

module.exports = {
  insertUserIntoDb,
  getUserFromDbByEmail,
  getUserFromDbByUserID,
  createUsersTable
};
