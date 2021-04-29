import { Context, Scenes } from 'telegraf'

interface MySession extends Scenes.WizardSession {
  // will be available under `ctx.session.mySessionProp`
  mySessionProp: number
}

interface MyContext extends Context {
  // will be available under `ctx.myContextProp`
  myContextProp: string

  // declare session type
  session: MySession
  // declare scene type
  scene: Scenes.SceneContextScene<MyContext, Scenes.WizardSessionData>
  // declare wizard type
  wizard: Scenes.WizardContextWizard<MyContext>
}
