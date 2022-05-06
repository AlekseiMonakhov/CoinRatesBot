const { Sequelize } = require('sequelize')

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

const modelDefiners = [
	require('./models/Cryptocurrencies'),
	require('./models/Currencies')
];

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize)
}

module.exports = sequelize