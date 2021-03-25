import './utils/env'
// import Event from './utils/mongoose'
// import redis from './utils/ioredis'
import { Telegraf, Scenes, session } from 'telegraf'
import createWizard from './scenes/createScene'

if (process.env.BOT_TOKEN === undefined) throw new Error('Bot token is undefined')
const bot = new Telegraf<Scenes.WizardContext>(process.env.BOT_TOKEN)
const stage = new Scenes.Stage<Scenes.WizardContext>([createWizard])
bot.use(session())
bot.use(stage.middleware())
bot.command('create', ctx => ctx.scene.enter('create-wizard'))

// const helpMessage = `/help - Display help message
// /create - Create event
// /list - List events
// /edit - Edit event
// /delete - Delete event`

// bot.start(ctx => {
//   ctx.reply(helpMessage)
// })
// bot.help(ctx => {
//   ctx.reply(helpMessage)
// })
// bot.command('list', ctx => {
//   if (ctx.chat.type === 'private') {
//     // list all event created by this user
//     ctx.reply('listing all events that you created')
//   } else {
//     // list all event in this group
//     ctx.reply('listing all events in this group')
//   }
// })
// bot.command('edit', ctx => {})
// bot.command('delete', ctx => {})

// launch or stop gracefully
bot.launch().then(() => console.log('Bot started'))
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
