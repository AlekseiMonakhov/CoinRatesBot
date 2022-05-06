const axios = require('axios')
const { models } = require('./db')

// SET RUB TO CURRENCIES RATES TO THE DATABASE TABLE
async function setCurrenciesRates() {

	try {
		const res = await axios.get(process.env.RU_CB_DAILY_RATES_URL, {
			headers: {
				'X-CMC_PRO_API_KEY': process.env.CRYPTO_API_KEY,
				'Accept': 'application/json',
				'Accept-Encoding': 'deflate, gzip'
			}
		})

		if (res.status === 200 && res.data.Valute) {

			let valuteArr = Object.keys(res.data.Valute).map((key, i) => {
				return {
					id: i,
					valute: res.data.Valute[key].CharCode,
					value: res.data.Valute[key].Value / res.data.Valute[key].Nominal
				}
			})

			valuteArr = valuteArr.filter(c => c.valute !== 'HKD' && c.valute !== 'TMT') // we use rbc site valutes only 

			await models.Currencies.bulkCreate(valuteArr, { 
				updateOnDuplicate: ["id", "valute", "value"] 
			})
			
			// const rubleRate = res.data.Valute.USD.Value

		} else {
			throw new Error('Can not set ruble rate')
		}

	} catch(e) {
		console.log('Can not set currency rate', e)
	}

}

module.exports = setCurrenciesRates