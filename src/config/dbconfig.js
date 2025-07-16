import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

const db = new Sequelize (
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false
    }
);

db.authenticate()
    .then(() => {
        console.log('Connected to MySQL database');
    })
    .catch((error) => {
        console.log('Unable to connect to the database:', error);
    });

export default db;