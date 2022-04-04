const axios = require('axios');
const sequelize = require('./database/connection').sequelize
const coinsModel = require("./models/coins").coinsModel;
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
            // console.log(coinsUsd.data, coinsBtc.data, coinsRub.data);
            coinsUsd.data.data.forEach(async function (item) {
                const id = item.id
                const symbol = item.symbol
                const price = item.quote.USD.price.toFixed(2)
                const percent_change_1h = item.quote.USD.percent_change_1h.toFixed(2)
                const ff = await sequelize.coinsModel.create(id, symbol, price, percent_change_1h)
                console.log(ff)

            })
        })
}

getData()

function extractData(arr) {
    arr.forEach(function (item) {
        const id = item.id
        const symbol = item.symbol
        const price = item.quote.price
        const percent_change_1h = item.quote.percent_change_1h
        console.log(id, symbol, price, percent_change_1h)
    })
}




