import { Sequelize } from "sequelize";
import dotenv from "dotenv";


dotenv.config();
const DB_NAME = process.env.DB_NAME || `logbook_security`;
const DB_USERNAME = process.env.DB_USERNAME || `root`;
const DB_PASSWORD = process.env.DB_PASSWORD || ``;
const DB_HOST = process.env.DB_HOST || `localhost`;

// Nyambungin db
const db = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
});

export default db;