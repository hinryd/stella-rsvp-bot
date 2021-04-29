import { Telegraf, Scenes, Context } from 'telegraf'
import RedisSession from 'telegraf-session-redis'
import eventCreator, { EventCreatorSession } from '../scenes/eventCreator'

export interface BotCtx extends Context {
  session: EventCreatorSession // extending session object
  scene: Scenes.SceneContextScene<BotCtx, Scenes.WizardSessionData>
  wizard: Scenes.WizardContextWizard<BotCtx>
}

if (process.env.BOT_TOKEN === undefined) throw new Error('BOT_TOKEN is required')
const bot = new Telegraf<BotCtx>(process.env.BOT_TOKEN)

const session = new RedisSession({
  store: {
    host: process.env.TELEGRAM_SESSION_HOST || '127.0.0.1',
    port: process.env.TELEGRAM_SESSION_PORT || 6379,
  },
})
bot.use(session)
const stage = new Scenes.Stage<BotCtx>([eventCreator])
bot.use(stage.middleware())

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export default bot
