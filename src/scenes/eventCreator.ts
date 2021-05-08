import { Scenes, Markup } from 'telegraf'
import BotCtx from '../bot/BotCtx.interface'
import supabase from '../utils/supabase'
import { Date } from 'sugar'
import printEvent from '../bot/printEvent'

export interface EventCreatorSession extends Scenes.WizardSession {
  state: {
    event_desc: string
    event_date: any
  }
}

const eventCreator = new Scenes.WizardScene<BotCtx>(
  'EVENT_CREATOR',
  async ctx => {
    ctx.session.state = { event_desc: '', event_date: new Date() }
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

    const { error } = await supabase.from('groups').upsert({ group_id: ctx.message.chat.id })

    if (!error) {
      await supabase
        .from('events')
        .upsert({
          group_id: ctx.message?.chat.id,
          event_desc: ctx.session.state.event_desc,
          event_date: ctx.session.state.event_date,
        })
        .then(
          async (res: { data: any }) =>
            await ctx
              .reply(
                printEvent(res.data[0].event_desc, [], res.data[0].event_date),
                Markup.inlineKeyboard([
                  Markup.button.callback('yes', `yes:${res.data[0].event_id}`),
                  Markup.button.callback('maybe', `maybe:${res.data[0].event_id}`),
                  Markup.button.callback('no', `no:${res.data[0].event_id}`),
                  // Markup.button.callback('+1', `addOne:${event.event_id}`),
                ])
              )
              .catch(err => console.log(err))
        )
    } else {
      await ctx.reply(JSON.stringify(error))
    }

    return await ctx.scene.leave()
  }
)

export default eventCreator
