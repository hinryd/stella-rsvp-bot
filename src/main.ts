import './utils/env'
import supabase from './utils/supabase'
import bot from './bot'
// import { DateTime } from 'luxon'

bot.command('create', ctx => {
  ctx.scene.enter('EVENT_CREATOR')
})

bot.command('list', async ctx => {
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
