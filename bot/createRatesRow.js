function createRatesRow(cryptoRatesRowData) {
	try {

		let { symbol, slug, BTC, USD, RUB, hour_percent_change } = cryptoRatesRowData

		USD = (Math.round(USD * 100) / 100).toFixed(2)
		USD = USD.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

		RUB = (Math.round(RUB * 100) / 100).toFixed(2)
		RUB = RUB.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

		BTC = BTC.toFixed(6)

		hour_percent_change = (Math.round(hour_percent_change * 100) / 100).toFixed(2) + '%'

		const cryptoUrl = process.env.CRYPTO_CURRENCIES_BASE_URL + slug

		const btcStr = symbol === 'BTC' ? '' : `${BTC} <b>₿</b> • `
		const usdStr = `${USD} <b>$</b> •`
		const rubStr = `${RUB} <b>₽</b> •`
		const hourStr = `${hour_percent_change} <b>1h</b>`

		return `<a href="${cryptoUrl}">${symbol}</a> • ${btcStr} ${usdStr} ${rubStr} ${hourStr}`

	} catch(e) {
		console.log(e)
		throw new Error('Error creating response rows')
	}
}

module.exports = createRatesRow