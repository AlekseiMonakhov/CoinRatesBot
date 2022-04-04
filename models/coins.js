const { Sequelize }  = require("sequelize");
const sequelize = require('../database/connection').sequelize

let coinsModel = sequelize.define('coins', {
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
        type: Sequelize.INTEGER
    },
    price_btc: {
        type: Sequelize.INTEGER
    },
    price_rub: {
        type: Sequelize.INTEGER
    },
    percent_change_1h: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: true
});

module.exports.coinsModel = coinsModel;