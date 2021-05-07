import { Scenes, Context } from 'telegraf'
import { EventCreatorSession } from '../scenes/eventCreator'
import { EventEditorSession } from '../scenes/eventEditor'

export default interface BotCtx extends Context {
  session: EventCreatorSession | EventEditorSession // extending session object
  scene: Scenes.SceneContextScene<BotCtx, Scenes.WizardSessionData>
  wizard: Scenes.WizardContextWizard<BotCtx>
}
