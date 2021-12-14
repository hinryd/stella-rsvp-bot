import BotCtx from '../bot/BotCtx.interface'

const create = (ctx: BotCtx) => ctx.scene.enter('EVENT_CREATOR')

export default create
