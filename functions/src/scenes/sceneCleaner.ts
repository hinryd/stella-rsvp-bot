import BotCtx from '../bot/BotCtx.interface'

const sceneCleaner = () => async (ctx: BotCtx) => {
  ctx.session.state.messages.forEach(({ message_id: id }) => {
    try {
      ctx.deleteMessage(id)
    } catch (error) {
      console.log(error)
    }
  })
}

export default sceneCleaner
