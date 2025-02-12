import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();


const externalDbUrl = process.env.EXTERNAL_DATABASE_URL || ""; // Ensure it's a string

const sequelize = externalDbUrl
  ? new Sequelize(externalDbUrl, {
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
  : new Sequelize({
      dialect: "postgres",
      host: process.env.DB_HOST || "localhost",
      port: parseInt(process.env.DB_PORT || "5432"),
      username: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "12345678",
      database: process.env.DB_NAME || "bitespeed",
      logging: false,
      dialectOptions: process.env.DB_SSL === "true"
        ? {
            ssl: {
              require: true,
              rejectUnauthorized: false,
            },
          }
        : undefined, // No SSL if DB_SSL is false or not set
    });

export default sequelize;
