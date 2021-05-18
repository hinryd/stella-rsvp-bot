import BotCtx from '../bot/BotCtx.interface'
import { Markup } from 'telegraf'
import supabase from '../utils/supabase'
import printEvent from '../bot/printEvent'

const del = async (ctx: BotCtx) => {
  const { data, error } = await supabase
    .from('events')
    .select('event_id, event_desc, event_date, updated_at')
    .eq('group_id', ctx.message?.chat.id)

  if (error) {
    ctx.reply(JSON.stringify(error))
  } else if (data !== null) {
    ctx.reply(
      'Select an event to delete',
      Markup.inlineKeyboard(
        data.map(event => {
          return [Markup.button.callback(event.event_desc, `del|${event.event_id}`)]
        })
      )
    )
  }
}

export default del
