import './utils/env'
import supabase from './utils/db'
import bot from './utils/bot'
// import { DateTime } from 'luxon'

bot.start(ctx => ctx.reply('Thank you for using Stella! Type /help for more information.'))

bot.help(ctx => ctx.reply('Under construction'))

bot.command('create', ctx => {
  ctx.scene.enter('EVENT_CREATOR')
})

bot.command('list', async ctx => {
  if (ctx.message.chat.type === 'private') return

  const { data, error } = await supabase.from('events').select()
  if (error) ctx.reply(JSON.stringify(error))
  else data?.map(event => ctx.reply(JSON.stringify(event)))
})

bot.command('delete', async ctx => {
  const { data, error } = await supabase.from('event').delete()
  if (error) ctx.reply(JSON.stringify(error))
  else ctx.reply('Event deleted')
})

bot.launch().then(() => console.log('[Stella] Bot started'))
