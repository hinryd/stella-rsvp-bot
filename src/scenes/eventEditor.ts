import { Scenes, Markup } from 'telegraf'
import BotCtx from '../bot/BotCtx.interface'
import supabase from '../utils/supabase'
import { Date } from 'sugar'
import printEvent from '../bot/printEvent'

export interface EventEditorSession extends Scenes.WizardSession {
  state: {
    event_id: string
    event_desc: string
    event_date: any
  }
}

const eventEditor = new Scenes.WizardScene<BotCtx>(
  'EVENT_EDITOR',
  async ctx => {
    await ctx.reply('Step 1: Enter description for your event', Markup.forceReply())
    return ctx.wizard.next()
  },
  async ctx => {
    if (ctx.message === undefined || !('text' in ctx.message))
      throw new Error('Missing ctx.message')
    ctx.session.state.event_desc = ctx.message.text
    await ctx.reply('Step 2: Enter date for your event', Markup.forceReply())
    return ctx.wizard.next()
  },
  async ctx => {
    if (ctx.message === undefined || !('text' in ctx.message))
      throw new Error('Missing ctx.message')

    const eventDate = Date.create(ctx.message.text)
    ctx.session.state.event_date = eventDate ? eventDate : new Date()

    await supabase
      .from('events')
      .update({
        event_desc: ctx.session.state.event_desc,
        event_date: ctx.session.state.event_date,
      })
      .match({ event_id: (ctx.session as EventEditorSession).state.event_id })
      .then(async (res: { data: any }) => {
        const responsesData = <{ data: any; error: any }>(
          await supabase.from('response').select().eq('event_id', res.data[0].event_id)
        )
        await ctx.reply(
          printEvent(
            res.data[0].event_desc,
            responsesData.data ? responsesData.data : [],
            res.data[0].event_date
          )
        )
      })

    return await ctx.scene.leave()
  }
)

export default eventEditor
