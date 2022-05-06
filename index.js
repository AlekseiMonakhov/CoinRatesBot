require('dotenv').config()
const db = require("./db")
require("./bot")
const setCurrenciesRates = require('./setCurrenciesRates')
const setCryptoRates = require('./setCryptoRates')


async function assertDatabaseConnectionOk() {
	console.log(`Checking database connection...`)
	try {
		await db.sync()
		await db.authenticate()
		console.log('Database connection OK!')
	} catch (error) {
		console.log('Unable to connect to the database:')
		console.log(error.message)
		process.exit(1);
	}
}

async function init() {
	await assertDatabaseConnectionOk()

	setCurrenciesRates()
	setCryptoRates()
	setInterval(setCurrenciesRates, 86400000)
	setInterval(setCryptoRates, 3600000)
}

init()
