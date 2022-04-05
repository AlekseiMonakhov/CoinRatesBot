const { Telegraf } = require('telegraf')
const { dataForBot } = require("./rates");
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply(`${dataForBot}`))

bot.launch()


process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))