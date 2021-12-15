// import './utils/env'
// import './bot'
// import { DateTime } from 'luxon'

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { Telegraf } from 'telegraf'

admin.initializeApp()
const { telegram } = functions.config()

const bot = new Telegraf(telegram.token, { telegram: { webhookReply: true } })
// bot.telegram.setWebhook(`https://f4be-218-253-155-136.ngrok.io/stella-rsvp-bot/us-central1/echoBot`)
// bot.telegram.setWebhook(`https://${REGION!}-${PROJECT_ID!}.cloudfunctions.net/${FUNCTION_NAME!}`)

bot.use(async (ctx, next) => {
  console.log('LOGGER', Date.now())
  await admin.firestore().collection('logs').add({
    timestamp: Date.now(),
    message: ctx.message
  })
  return next()
})
bot.command('hello', (ctx) => ctx.reply('Hello, friend!'))

exports.echoBot = functions.https.onRequest(async (req, res) => {
  try {
    await bot.handleUpdate(req.body)
  } finally {
    res.status(200).end()
  }
})
