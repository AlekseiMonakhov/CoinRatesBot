'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const db = {};

const DB = 'botDb';
const USER = 'postgres';
const PASSWORD = 'password';
const HOST = '127.0.0.1';
const DIALECT = 'postgres';
const PORT = 5432;

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