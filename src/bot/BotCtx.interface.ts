import { Scenes, Context } from 'telegraf'
import { EventCreatorSession } from '../scenes/eventCreator'

export default interface BotCtx extends Context {
  session: EventCreatorSession // extending session object
  scene: Scenes.SceneContextScene<BotCtx, Scenes.WizardSessionData>
  wizard: Scenes.WizardContextWizard<BotCtx>
}
