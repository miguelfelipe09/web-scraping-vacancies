import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

export const pool = mysql.createPool({
  host: 'localhost',
  user: process.env.mySqlUser,
  password: process.env.mySqlPass,
  database: process.env.database,
  waitForConnections: true,
  connectionLimit: 10, // máximo de conexões abertas simultâneas
  queueLimit: 0
});
