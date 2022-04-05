const { Sequelize }  = require("sequelize");
const sequelize = require('../database/connection').sequelize

let Coins = sequelize.define('coins', {
    id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
    },
    symbol: {
        type: Sequelize.STRING,
        allowNull: false
    },
    price_usd: {
        type: Sequelize.STRING
    },
    price_btc: {
        type: Sequelize.STRING
    },
    price_rub: {
        type: Sequelize.STRING
    },
    percent_change_1h: {
        type: Sequelize.STRING
    }
}, {
    timestamps: true
});

Coins.sync({ force: true })

module.exports.Coins = Coins;