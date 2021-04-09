import './utils/env'
// import Event from './utils/mongoose'
// import redis from './utils/ioredis'
import TeleBot from 'telebot'

if (process.env.BOT_TOKEN === undefined) throw new Error('Bot token is required')
const bot = new TeleBot({
  token: process.env.BOT_TOKEN,
})

bot.on('text', msg => msg.reply.text(msg.text))

// launch or stop gracefully
bot.start()
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
