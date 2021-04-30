import { Middleware } from 'telegraf'
import BotCtx from '../bot/BotCtx.interface'

const isPrivateChat = (): Middleware<BotCtx> => (ctx, next) => {
  if (ctx.message?.chat.type === 'private') return
  return next()
}

export default isPrivateChat
