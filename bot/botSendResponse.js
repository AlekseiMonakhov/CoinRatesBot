const { models } = require('../db')
const createRatesRow = require('./createRatesRow') 

async function sendTopRates(ctx, fields) {
	const currencyData = await models.Cryptocurrencies.findAll({
			attributes: fields,
			limit: 10
	})	

	let topCurrenciesStr = '' 
	currencyData.forEach(c => {
		topCurrenciesStr = topCurrenciesStr + createRatesRow(c.dataValues) + '\n'
	}) 

	ctx.replyWithHTML(topCurrenciesStr, 
	{
		disable_web_page_preview: true
	})
} 

async function botSendResponse(ctx) {

	const defaultSettingsToSend = ['symbol', 'slug', 'BTC', 'USD', 'RUB', 'hour_percent_change']

	try {
		// parse command
		const text = ctx.update.message.text
		const command = text.substring(1).toLowerCase()

		if (command === 'rates') {
			await sendTopRates(ctx, defaultSettingsToSend)
		}

		//try to find currency
		const currencyData = await models.Cryptocurrencies.findOne({
	  		attributes: defaultSettingsToSend,
	  		where: {
	  			symbol: command.toUpperCase()
	  		}
		})	
		// if currency found send responce
		if (currencyData) {
			
			ctx.replyWithHTML(createRatesRow(currencyData.dataValues), 
			{
				disable_web_page_preview: true
			})
 		}

	} catch (e) {
		console.log(e)
		throw new Error('Error sending response')
	}
}

module.exports = botSendResponse