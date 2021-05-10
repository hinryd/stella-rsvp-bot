import BotCtx from './BotCtx.interface'
import { Markup } from 'telegraf'
import supabase from '../utils/supabase'
import printEvent from '../bot/printEvent'

interface ResCtx extends BotCtx {
  match: RegExpExecArray
  update: {
    update_id: number
    callback_query: any
  }
}

const responseHandler = async (ctx: ResCtx) => {
  // receiving ''|'' as input
  const { id, first_name, username } = ctx.update.callback_query.from
  const msg = ctx.update.callback_query.message?.message_id
  const [input, command, event_id] = ctx.match
  console.log('ERROR: INPUT', ctx.match)

  await supabase
    .from('users')
    .upsert({ group_id: ctx.update.callback_query.message?.chat.id, user_id: id, username })

  switch (command) {
    case 'yes':
      await supabase
        .from('responses')
        .upsert({
          event_id,
          user_id: id,
          nickname: first_name,
          confirmed: true,
        })
        .then(res => console.log(res))
      break
    case 'maybe':
      await supabase.from('responses').upsert({
        event_id,
        user_id: id,
        nickname: first_name,
        confirmed: false,
      })
      break
    case 'addOne':
      await supabase.from('responses').upsert({
        event_id,
        user_id: id,
        nickname: first_name,
        confirmed: true,
        append: 1,
      })
      break
    case 'no':
      await supabase.from('responses').delete().match({
        event_id,
        user_id: id,
      })
      break
    case 'del':
      await supabase.from('events').delete().match({ event_id })
      return ctx.editMessageText(`Event ${event_id} has been deleted`)
    case 'edit':
      const { data, error } = <{ data: any; error: any }>(
        await supabase
          .from('events')
          .select('event_id, event_desc, event_date, updated_at')
          .match({ event_id })
      )
      ctx.reply(printEvent(data[0].event_desc, [], data[0].event_date))
      ctx.session.state = {
        event_id,
        event_desc: data[0].event_desc,
        event_date: data[0].event_date,
      }
      return ctx.scene.enter('EVENT_EDITOR')
    default:
      break
  }

  const eventData: any = await supabase
    .from('events')
    .select('event_id, event_desc, event_date')
    .eq('event_id', event_id)

  const responsesData = await supabase
    .from('responses')
    .select('nickname, confirmed, append')
    .eq('event_id', event_id)

  if (eventData.data === null) throw 'Error'
  if (responsesData.data === null) throw 'Error'

  return ctx
    .editMessageText(
      printEvent(eventData.data[0].event_desc, responsesData.data, eventData.data[0].event_date),
      Markup.inlineKeyboard([
        Markup.button.callback('yes', `yes|${eventData.data[0].event_id}`),
        Markup.button.callback('maybe', `maybe|${eventData.data[0].event_id}`),
        Markup.button.callback('no', `no|${eventData.data[0].event_id}`),
        // Markup.button.callback('+1', `addOne:${eventData.data[0].event_id}`),
      ])
    )
    .catch(err => console.log(err))
}

export default responseHandler
