const axios = require('axios');
require('dotenv').config({path: './.env'})
const Coins = require('./models/coins').Coins

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
async function getData() {
    await Coins.sync({ force: true });
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

const dataForBot = []


async function sendData () {
    const data = await Coins.findAll();
    for (const item of data) {
        const symbol = item.symbol
        const price_btc = item.price_btc
        const price_usd = item.price_usd
        const price_rub = item.price_rub
        const percent_change_1h = item.percent_change_1h
        dataForBot.push(`\n${symbol} | ${price_btc} ₿ | ${price_usd} $ | ${price_rub} ₽ | ${percent_change_1h}% 1h`)
    }
}

sendData()

module.exports.dataForBot = dataForBot;




