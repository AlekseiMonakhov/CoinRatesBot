const axios = require('axios');
const sequelize = require('./database/connection').sequelize
const Coins = require('./models/coins').Coins
require('dotenv').config()
const apiKey = process.env.API_KEY

function getCoinsUsd() {
    return axios.get( 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=10', {
        headers: { 'X-CMC_PRO_API_KEY': `${apiKey}`}
    });
}

function getCoinsBtc() {
    return axios.get( 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?convert=BTC&limit=10', {
        headers: { 'X-CMC_PRO_API_KEY': `${apiKey}`}
    });
}

function getCoinsRub() {
    return axios.get( 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?convert=RUB&limit=10', {
        headers: { 'X-CMC_PRO_API_KEY': `${apiKey}`}
    });
}
function getData() {
    Promise.all([getCoinsUsd(), getCoinsBtc(), getCoinsRub()])
        .then(function (results) {
            const coinsUsd = results[0];
            const coinsBtc = results[1];
            const coinsRub = results[2];
            coinsUsd.data.data.forEach(async function (item) {
                const id = item.id
                const symbol = item.symbol
                const price_usd = item.quote.USD.price.toFixed(2)
                const percent_change_1h = item.quote.USD.percent_change_1h.toFixed(2)
                console.log(id, symbol, price_usd, percent_change_1h)
                const createRecord = await Coins.create({
                    id: id,
                    symbol: symbol,
                    price_usd: price_usd,
                    percent_change_1h: percent_change_1h
                })
            }),
                coinsBtc.data.data.forEach(async function (item) {
                    const id = item.id
                    const price_btc = item.quote.BTC.price.toFixed(5)
                    const addBtcPrice = await Coins.update(
                        {
                            price_btc: price_btc,
                        },
                        {
                            where: { id: id },
                        })
                }),
                coinsRub.data.data.forEach(async function (item) {
                    const id = item.id
                    const price_rub = item.quote.RUB.price.toFixed(2)
                    const addBtcPrice = await Coins.update(
                        {
                            price_rub: price_rub,
                        },
                        {
                            where: {id: id},
                        })
                })

        })
}
getData()





