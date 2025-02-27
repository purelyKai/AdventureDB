import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function createConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }, // Disable strict SSL
    });

    console.log("Connected to database ✅");
    return connection;
  } catch (error) {
    console.error("Database connection failed ❌", error);
    throw error;
  }
}

// Call `createConnection()` wherever you need a DB connection
export default createConnection;
