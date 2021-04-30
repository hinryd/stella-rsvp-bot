import { Scenes } from 'telegraf'
import BotCtx from '../bot/BotCtx.interface'
import supabase from '../utils/supabase'

export interface EventCreatorSession extends Scenes.WizardSession {
  state: {
    event_desc: any
    event_date: Date
  }
}

const eventCreator = new Scenes.WizardScene<BotCtx>(
  'EVENT_CREATOR',
  async ctx => {
    ctx.session.state = { event_desc: 'hello', event_date: new Date() }
    await ctx.reply('Step 1: Enter description for your event')
    return ctx.wizard.next()
  },
  async ctx => {
    if (ctx.message === undefined) return await ctx.scene.leave()
    if (!('text' in ctx.message)) return await ctx.scene.leave()
    ctx.session.state.event_desc = ctx.message.text
    await ctx.reply('Step 2: Enter date for your event')
    return ctx.wizard.next()
  },
  async ctx => {
    ctx.session.state.event_date = new Date()
    ctx.reply(JSON.stringify(ctx.session))
    // const { data, error } = await supabase
    //   .from('event')
    //   .insert([{ event_desc: ctx.session.event_desc, event_date: ctx.session.event_date }])
    // if (error) await ctx.reply(JSON.stringify(error))
    // else await ctx.reply('Event created successfully')
    return await ctx.scene.leave()
  }
)

export default eventCreator
