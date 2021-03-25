import { Scenes } from 'telegraf'

const createWizard = new Scenes.WizardScene<Scenes.WizardContext>(
  'create-wizard',
  async ctx => {
    await ctx.reply('Step 1')
    return ctx.wizard.next()
  },
  async ctx => {
    await ctx.reply(`Step 3.`)
    return ctx.wizard.next()
  },
  async ctx => {
    await ctx.reply('Step 4')
    return ctx.wizard.next()
  },
  async ctx => {
    await ctx.reply('Done')
    return await ctx.scene.leave()
  }
)

export default createWizard
