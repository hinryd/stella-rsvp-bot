import { Scenes, Markup } from 'telegraf'
import BotCtx from '../bot/BotCtx.interface'
import supabase from '../utils/supabase'
import { Date } from 'sugar'
import printEvent from '../bot/printEvent'

export interface EventEditorSession extends Scenes.WizardSession {
  state: {
    messages: any[]
    event_id: string
    event_desc: string
    event_date: any
  }
}

const eventEditor = new Scenes.WizardScene<BotCtx>(
  'EVENT_EDITOR',
  async (ctx) => {
    const message = await ctx
      .reply(
        '[1/2] Reply this message to set your event description',
        Markup.forceReply().selective()
      )
      .catch((err) => console.error('EDIT-SCENE-1', err))
    ctx.session.state.messages.push(message)
    return ctx.wizard.next()
  },

  async (ctx) => {
    if (ctx.message === undefined || !('text' in ctx.message))
      throw new Error('Missing ctx.message')
    ctx.session.state.event_desc = ctx.message.text
    const message = await ctx
      .reply(
        `[2/2] Reply this message to set your event date and time, e.g. 'tomorrow 2 pm' or 'june 26 17:00'`,
        Markup.forceReply().selective()
      )
      .catch((err) => console.error('EDIT-SCENE-2', err))
    ctx.session.state.messages.push(message)
    return ctx.wizard.next()
  },

  async (ctx) => {
    if (ctx.message === undefined || !('text' in ctx.message))
      throw new Error('Missing ctx.message')

    const eventDate = Date.create(ctx.message.text, { fromUTC: true })
    ctx.session.state.event_date = eventDate ? eventDate : new Date()

    await supabase
      .from('events')
      .update({
        event_desc: ctx.session.state.event_desc,
        event_date: ctx.session.state.event_date
      })
      .match({ event_id: (ctx.session as EventEditorSession).state.event_id })
      .then(async (res) => {
        if (res.data === null) return
        const { data, error } = await supabase
          .from('response')
          .select()
          .eq('event_id', res.data[0].event_id)

        await ctx.reply(
          printEvent(res.data[0].event_desc, data ? data : [], res.data[0].event_date),
          Markup.inlineKeyboard([
            Markup.button.callback('yes', `yes|${res.data[0].event_id}`),
            Markup.button.callback('maybe', `maybe|${res.data[0].event_id}`),
            Markup.button.callback('no', `no|${res.data[0].event_id}`)
            // Markup.button.callback('+1', `addOne:${event.event_id}`),
          ])
        )
      })
    ctx.session.state.messages.map(async ({ message_id }) => {
      await ctx.deleteMessage(message_id).catch((err) => console.log('EDIT-SCENE-DELETE', err))
    })
    return ctx.scene.leave()
  }
)

export default eventEditor
