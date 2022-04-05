const Sequelize = require('sequelize');
require('dotenv').config({path: '../.env'})

const DB = process.env.DB_NAME;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASS;
const HOST = process.env.DB_HOST;
const DIALECT = process.env.DB_DIALECT;
const PORT = process.env.DB_PORT;

const sequelize = new Sequelize(
    DB,
    USER,
    PASSWORD,
    {
        host: HOST,
        dialect: DIALECT,
        port: PORT,
    }
)




async function Autenticate() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

Autenticate();

module.exports.sequelize = sequelize;