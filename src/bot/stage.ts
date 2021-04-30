import { Scenes } from 'telegraf'
import BotCtx from './BotCtx.interface'
import eventCreator from '../scenes/eventCreator'

const stage = new Scenes.Stage<BotCtx>([eventCreator])

export default stage
