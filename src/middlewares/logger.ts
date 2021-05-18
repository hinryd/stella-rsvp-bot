import { Middleware } from 'telegraf'
import BotCtx from '../bot/BotCtx.interface'

const logger = (): Middleware<BotCtx> => (ctx, next) => {
  console.log('LOGGER', ctx)
  return next()
}

export default logger
