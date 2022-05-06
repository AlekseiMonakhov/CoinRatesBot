const axios = require('axios')
const { models } = require('./db')

async function getAllCoinIds() {

	try {
	    const res = await axios.get(process.env.CRYPTO_MAP_URL, {
			headers: {
				'X-CMC_PRO_API_KEY': process.env.CRYPTO_API_KEY,
				'Accept': 'application/json',
				'Accept-Encoding': 'deflate, gzip'
			},
			params: {
				sort: 'cmc_rank' // SORT BY RANK
			}
		})

		if (res.status !== 200 || !res.data || !res.data.data) {
	    	throw new Error('Can not get rates')
	    } 

	    return res.data.data

	} catch(e) {
		console.log('Can not get coin ids')
	}
}

async function getCryptoRates(numberOfActiveCoins) {
	try {
		const maxReqCoins = 5000 // API limit
		const numberOfReqs = Math.round(numberOfActiveCoins / maxReqCoins) 
		
		const cryptoRates = []

		for (let i=0; i <= 1; i++) {
			let res = await axios.get(process.env.CRYPTO_URL, {
				headers: {
					'X-CMC_PRO_API_KEY': process.env.CRYPTO_API_KEY,
					'Accept': 'application/json',
					'Accept-Encoding': 'deflate, gzip'
				},
				params: { 
					'start': String((i*maxReqCoins)+1),
					'limit': String(maxReqCoins)
				}
	    	})

	    	if (res.status !== 200 || !res.data || !res.data.data) {
	    		throw new Error('Can not get rates')
	    	}

	    	cryptoRates.push(...res.data.data)
		}

		console.log(`Recieved ${cryptoRates.length} items`)

		return cryptoRates 

	} catch(e) {
		console.log('Can not get coin ids',e)
	}
}

// TODO: for more accurate results maybe change to some API call
function getCryptocoinToCurrenciesPrices(coinUsd, usdRur, currencyRur) {
	const coinRur = coinUsd * usdRur
	return coinRur / currencyRur
}

async function addRealCurrenciesToCryptoRates(cryptoRates) {

	let currenciesRates = await models.Currencies.findAll({
	  		attributes: ['valute', 'value']
	})

	if (!currenciesRates) {
			throw new Error('Can not get currencies')
	}

	const usdRurRate = currenciesRates.filter(c => c.dataValues.valute === 'USD')[0].dataValues.value

	// Add real currencies rates (33) to each coin 
	return cryptoRates.map((cryptoCurr,i) => {
		const usdCoinPrice = cryptoCurr.quote.USD.price // coin price in USD 

		const cryptocurrencyToRealCurrenciesArr = {}
		for (currency of currenciesRates) {
			const valuteSymbol = currency.dataValues.valute
			const valuteRurRate = currenciesRates.filter(c => c.dataValues.valute === valuteSymbol)[0].dataValues.value
			cryptocurrencyToRealCurrenciesArr[valuteSymbol] = getCryptocoinToCurrenciesPrices(usdCoinPrice, usdRurRate, valuteRurRate)
		}

		return {
			...cryptoCurr,
			valutes: { ...cryptocurrencyToRealCurrenciesArr }
		}
	})
} 


async function handleCryptoratesDataAndInsertToDb(cryptoRates) {
	try {

		// Find real valute rates in db
		let realCurrenciesRates = await models.Currencies.findAll({
	  		attributes: ['valute', 'value']
		})

		if (!realCurrenciesRates) {
			throw new Error('Can not get currencies')
		}
		// Calculate and append real valute rates for each coin
		realCurrenciesRates = realCurrenciesRates.map(c => c.dataValues)
		cryptoRates = await addRealCurrenciesToCryptoRates(cryptoRates)
		
		// Find BTC and ETH prices in USD
		const btcId = 1   // Hardcoded coinmarket cap id
		const ethId = 1027 // Hardcoded coinmarket cap id
		const btcUsdPrice = cryptoRates.filter(e => e.id === btcId)[0].quote.USD.price
		const ethUsdPrice = cryptoRates.filter(e => e.id === ethId)[0].quote.USD.price
		const usdRub = realCurrenciesRates.filter(e => e.valute === 'USD')[0].value
		
		// Prepare array for table insert
		const tableArr = cryptoRates.map((c) => {
			return {
				id: c.cmc_rank,
				cmc_id: c.id,
				symbol: c.symbol,
				slug: c.slug,
				hour_percent_change: c.quote.USD.percent_change_1h,
				last_updated: c.last_updated,
				BTC: c.id === ethId ? ethUsdPrice / btcUsdPrice : c.quote.USD.price / btcUsdPrice,
				ETH: c.id === btcId ? btcUsdPrice / ethUsdPrice : c.quote.USD.price / ethUsdPrice,
				RUB: c.quote.USD.price * usdRub,
				...c.valutes
			}
		})

		await models.Cryptocurrencies.truncate({ cascade: true })
		await models.Cryptocurrencies.bulkCreate(tableArr)

	} catch(e) {
		console.log(e)
	}
}

async function setCryptoRates() {
	const ids = await getAllCoinIds()
	const numberOfActiveCoins = ids.length
	const cryptoRates = await getCryptoRates(numberOfActiveCoins)

	await handleCryptoratesDataAndInsertToDb(cryptoRates)

}


module.exports = setCryptoRates