import { Scenes, Markup } from 'telegraf'
import BotCtx from '../bot/BotCtx.interface'
import supabase from '../utils/supabase'
import { Date } from 'sugar'
import printEvent from '../bot/printEvent'

export interface EventCreatorSession extends Scenes.WizardSession {
  state: {
    messages: any[]
    event_desc: string
    event_date: any
  }
}

const eventCreator = new Scenes.WizardScene<BotCtx>(
  'EVENT_CREATOR',
  async (ctx) => {
    ctx.session.state.event_desc = ''
    ctx.session.state.event_date = new Date()
    ctx.session.state.messages = []
    const message = await ctx
      .reply(
        '[1/2] Reply this message to set your event description',
        Markup.forceReply().selective()
      )
      .catch((err) => console.error('CREATE-SCENE-1', err))
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
      .catch((err) => console.error('CREATE-SCENE-2', err))
    ctx.session.state.messages.push(message)
    return ctx.wizard.next()
  },

  async (ctx) => {
    if (ctx.message === undefined || !('text' in ctx.message))
      throw new Error('Missing ctx.message')

    const eventDate = Date.create(ctx.message.text, { fromUTC: true })
    ctx.session.state.event_date = eventDate ? eventDate : new Date()

    await supabase
      .from('groups')
      .upsert({ group_id: ctx.message.chat.id })
      .then(async (res) => {
        const { data, error } = await supabase.from('events').upsert({
          group_id: ctx.message?.chat.id,
          event_desc: ctx.session.state.event_desc,
          event_date: ctx.session.state.event_date
        })
        if (!error && data !== null) {
          await ctx
            .reply(
              printEvent(data[0].event_desc, [], data[0].event_date),
              Markup.inlineKeyboard([
                Markup.button.callback('yes', `yes|${data[0].event_id}`),
                Markup.button.callback('maybe', `maybe|${data[0].event_id}`),
                Markup.button.callback('no', `no|${data[0].event_id}`)
                // Markup.button.callback('+1', `addOne:${event.event_id}`),
              ])
            )
            .catch((err) => console.error('CREATE-SCENE-3', err))
        } else {
          console.log('CREATE-SCENE-SUPABASE-2')
        }
      })

    ctx.session.state.messages.map(async ({ message_id }) => {
      await ctx.deleteMessage(message_id).catch((err) => console.log('CREATE-SCENE-DELETE', err))
    })

    return ctx.scene.leave()
  }
)

export default eventCreator
