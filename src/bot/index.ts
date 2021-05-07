import BotCtx from './BotCtx.interface'
import { Telegraf } from 'telegraf'
import isPrivateChat from '../middlewares/isPrivateChat'
import session from './session'
import stage from './stage'
import responseHandler from './responseHandler'
import create from '../commands/create'
import list from '../commands/list'
import edit from '../commands/edit'
import del from '../commands/del'

if (process.env.BOT_TOKEN === undefined) throw new Error('BOT_TOKEN is required')
const bot = new Telegraf<BotCtx>(process.env.BOT_TOKEN)

// helper commands
bot.start(ctx => ctx.reply('Thank you for using Stella! Type /help for more information.'))
bot.help(ctx => ctx.reply('Under construction'))

// middleware
bot.use(isPrivateChat())
bot.use(session)
bot.use(stage.middleware())

// commands
bot.command('create', create)
bot.command('list', list)
bot.command('edit', edit)
bot.command('del', del)

// actions
bot.action(/(.+):(.+)/, responseHandler)

// Start bot
bot.launch().then(() => console.log('[Stella] Bot started'))

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
