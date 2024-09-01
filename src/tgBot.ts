import { Telegraf } from 'telegraf'
import logger from './logger.js'
import { BOT_UPDATE_MSG_BULK_SIZE } from './constants.js'
import { startProcessingLogs } from './index.js'

let activeChatIds: string[] = []
let defiMessages: string[] = []

const bot = new Telegraf("7486446479:AAHCKWZnbzs9lkDM620yRA3l68B1sS70IJ0")
bot.start(ctx => replyWelcomeAndSaveId(ctx))
bot.launch()

function replyWelcomeAndSaveId(ctx) {
  ctx.reply('Welcome to Helius DeFi Feed! You will get DeFi updates from Jupiter, Marginfy and Orca. \n \n It may take up to 5 minutes to start getting updates')
  activeChatIds.push(ctx.from.id)
  startProcessingLogs()
}

function sendMessageToChat(chatId: string, msg: string) {
  logger.debug(`chatId: ${chatId}, msg: ${msg}`)
  bot.telegram.sendMessage(chatId, msg)
}

function sendUpdateMsgToChats(msg: string) {
  logger.debug(`msg: ${msg}`)
  activeChatIds.forEach(chatId => {
    sendMessageToChat(chatId, msg)
  })
}

function sendQueuedMessages() {
  let bulkedMsg = ""

  defiMessages.forEach(msg => {
    bulkedMsg = `${bulkedMsg} \n ${msg}`
  })

  activeChatIds.forEach(chatId => {
    sendMessageToChat(chatId, bulkedMsg)
  })

  defiMessages = [];
}

export function addDeFiUpdateMessageToQueue(msg: string) {
  defiMessages.push(msg)
  if (defiMessages.length > BOT_UPDATE_MSG_BULK_SIZE) {
    sendQueuedMessages();
  }
}

export function stopUpdates() {
  if (defiMessages.length > 0) {
    sendQueuedMessages();
  }

  sendUpdateMsgToChats("Stopped processing logs to save my Helius credits. Please, call /start again if you want more")

  activeChatIds = []
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))