import BotCtx from './BotCtx.interface'
import { Telegraf } from 'telegraf'
import isPrivateChat from '../middlewares/isPrivateChat'
import session from './session'
import stage from './stage'

if (process.env.BOT_TOKEN === undefined) throw new Error('BOT_TOKEN is required')
const bot = new Telegraf<BotCtx>(process.env.BOT_TOKEN)

// helper commands
bot.start(ctx => ctx.reply('Thank you for using Stella! Type /help for more information.'))
bot.help(ctx => ctx.reply('Under construction'))

// middleware
bot.use(isPrivateChat())
bot.use(session)
bot.use(stage.middleware())

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export default bot
