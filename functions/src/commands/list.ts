import BotCtx from '../bot/BotCtx.interface'
import { Markup } from 'telegraf'
import supabase from '../utils/supabase'
import printEvent from '../bot/printEvent'

const list = async (ctx: BotCtx) => {
  const { data, error } = await supabase
    .from('events')
    .select('event_id, event_desc, event_date, updated_at')
    .eq('group_id', ctx.message?.chat.id)

  if (error) {
    ctx.reply(JSON.stringify(error))
  } else if (data !== null) {
    data.map(async event => {
      const { data, error } = await supabase
        .from('responses')
        .select('confirmed, nickname')
        .eq('event_id', event.event_id)

      if (data === null) throw error

      ctx.reply(
        printEvent(event.event_desc, data, event.event_date),
        Markup.inlineKeyboard([
          Markup.button.callback('yes', `yes|${event.event_id}`),
          Markup.button.callback('maybe', `maybe|${event.event_id}`),
          Markup.button.callback('no', `no|${event.event_id}`),
          // Markup.button.callback('+1', `addOne:${event.event_id}`),
        ])
      )
    })
  }
}

export default list
