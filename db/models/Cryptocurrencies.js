const { DataTypes } = require('sequelize')

module.exports = (sequelize) => {
	sequelize.define('Cryptocurrencies', {
		id: { 
			type: DataTypes.FLOAT, 
			primaryKey: true,
		},
		cmc_id: DataTypes.FLOAT,
		symbol: DataTypes.STRING,
		slug: DataTypes.STRING,
		hour_percent_change: DataTypes.FLOAT,
		last_updated: DataTypes.STRING,
		BTC: DataTypes.FLOAT,
		ETH: DataTypes.FLOAT,
		USD: DataTypes.FLOAT,
		RUB: DataTypes.FLOAT,
		AUD: DataTypes.FLOAT,
		AZN: DataTypes.FLOAT,
		GBP: DataTypes.FLOAT,
		AMD: DataTypes.FLOAT,
		BYN: DataTypes.FLOAT,
		BGN: DataTypes.FLOAT,
		BRL: DataTypes.FLOAT,
		HUF: DataTypes.FLOAT,
		DKK: DataTypes.FLOAT,
		INR: DataTypes.FLOAT,
		KZT: DataTypes.FLOAT,
		CAD: DataTypes.FLOAT,
		KGS: DataTypes.FLOAT,
		CNY: DataTypes.FLOAT,
		MDL: DataTypes.FLOAT,
		NOK: DataTypes.FLOAT,
		PLN: DataTypes.FLOAT,
		RON: DataTypes.FLOAT,
		XDR: DataTypes.FLOAT,
		SGD: DataTypes.FLOAT,
		TJS: DataTypes.FLOAT,
		TRY: DataTypes.FLOAT,
		TMT: DataTypes.FLOAT,
		UZS: DataTypes.FLOAT,
		UAH: DataTypes.FLOAT,
		CZK: DataTypes.FLOAT,
		SEK: DataTypes.FLOAT,
		CHF: DataTypes.FLOAT,
		ZAR: DataTypes.FLOAT,
		KRW: DataTypes.FLOAT,
		JPY: DataTypes.FLOAT
	},
	{
    	timestamps: false
	})
}