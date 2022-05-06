const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.TELEGRAM_BOT_KEY)
const botSendResponse = require('./botSendResponse')

if (process.env.TELEGRAM_BOT_KEY === undefined) {
	throw new TypeError('BOT_TOKEN must be provided!')
}

bot.on('text', botSendResponse)
bot.launch()


process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
