import BotCtx from '../bot/BotCtx.interface'
import { Markup } from 'telegraf'
import supabase from '../utils/supabase'

const edit = async (ctx: BotCtx) => {
  const { data, error } = await supabase
    .from('events')
    .select('event_id, event_desc, event_date, updated_at')
    .eq('group_id', ctx.message?.chat.id)

  if (!error && data !== null) {
    await ctx
      .reply(
        'Select an event to edit',
        Markup.inlineKeyboard(
          data.map((event) => {
            return [Markup.button.callback(event.event_desc, `edit|${event.event_id}`)]
          })
        )
      )
      .catch((err) => console.error('EDIT-ENTRY-REPLY', err))
  } else {
    console.error('EDIT-ENTRY-SUPABASE', error)
  }
}

export default edit
