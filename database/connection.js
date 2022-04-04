const Sequelize = require("sequelize");
require('dotenv').config({path: '../.env'})

const config = {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT
}

let sequelize = new Sequelize(config);

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