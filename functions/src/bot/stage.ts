import { Scenes } from 'telegraf'
import BotCtx from './BotCtx.interface'
import eventCreator from '../scenes/eventCreator'
import eventEditor from '../scenes/eventEditor'

const stage = new Scenes.Stage<BotCtx>([eventCreator, eventEditor])

export default stage
