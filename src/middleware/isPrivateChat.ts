import { Middleware } from 'telegraf'
import { BotCtx } from '../utils/bot'

const isPrivateChat = (): Middleware<BotCtx> => (ctx, next) => {
  if (ctx.message?.chat.type === 'private') return
  return next()
}

export default isPrivateChat
