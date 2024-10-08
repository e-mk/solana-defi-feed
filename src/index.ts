import {Connection, Keypair, LogsCallback} from '@solana/web3.js';
import { Wallet, AnchorProvider } from "@coral-xyz/anchor"
import logger from './logger.js'
import express from 'express';

import DefiEventProcessor from './DeFiTxProcessor.js';
import IxProcessorFactory from './IxProcessorFactory.js';
import { stopUpdates } from './tgBot.js';
import { JUP_LIMIT_ORDER_PROGRAM_PK, JUP_SWAP_PROGRAM_PK, MARGINFY_PROGRAM_PK, marginfyProgPk, jupLimitOrderProgPk, ORCA_PROGRAM_PK, orcaProgPk, HELIUS_RPC_URL, HELIUS_API_KEY, LOG_COUNTER_LIMIT_BIG, LOG_COUNTER_LIMIT_SMALL } from './constants.js';

// const connection = new Connection("https://api.mainnet-beta.solana.com");
const connection = new Connection(`${HELIUS_RPC_URL}/?api-key=${HELIUS_API_KEY}`);

const keypair = Keypair.generate()
const wallet = new Wallet(keypair)
const provider = new AnchorProvider(connection, wallet, {
  commitment: "finalized",
})

let logCallbackCounter = 0;
let jupSwapProgLogListenerId: number;
let jupLimitOrderProgLogListenerId: number;
let marginfyProgLogListenerId: number;
let orcaProgLogListenerId: number;
let activeLogListenerIds: Set<number> = new Set<number>()
let defiEventProcessor: DefiEventProcessor

async function main() {

  const ixProcessorFactory = new IxProcessorFactory(provider)
  await ixProcessorFactory.initProcessors()
  defiEventProcessor = new DefiEventProcessor(connection, ixProcessorFactory)

  const app = express()
  const port = process.env.PORT || 3000
  
  app.get('/', (_req, res) => {
    res.send('Hello Helius!')
  })
  
  app.listen(port, () => {
    logger.debug(`App listening on port ${port}`)
  })
}

function stopListeningJupSwap() {
  logger.debug("STOP Processing Jup Swap Logs");
  connection.removeOnLogsListener(jupSwapProgLogListenerId);
  activeLogListenerIds.delete(jupSwapProgLogListenerId)
}

function stopListeningJupLimitOrder() {
  logger.debug("STOP Processing Jup Limit Order Logs");
  connection.removeOnLogsListener(jupLimitOrderProgLogListenerId);
  activeLogListenerIds.delete(jupLimitOrderProgLogListenerId)
}

function stopListeningMarginfy() {
  logger.debug("STOP Processing Marginfy Logs");
  connection.removeOnLogsListener(marginfyProgLogListenerId);
  activeLogListenerIds.delete(marginfyProgLogListenerId)
}

function stopListeningOrca() {
  logger.debug("STOP Processing Orca Logs");
  connection.removeOnLogsListener(orcaProgLogListenerId);
  activeLogListenerIds.delete(orcaProgLogListenerId)
}

export function startProcessingLogs() {

  if (activeLogListenerIds.size > 0) {
    logger.debug("The logs are already processing")
    return
  }

  logger.debug("START Processing Jup Swap Logs");
  const jupSwapLogsCallback: LogsCallback = createLogsCallback(defiEventProcessor, 
    JUP_SWAP_PROGRAM_PK, LOG_COUNTER_LIMIT_SMALL, stopListeningJupSwap)
  jupSwapProgLogListenerId = connection.onLogs(jupLimitOrderProgPk, jupSwapLogsCallback, 'finalized');
  activeLogListenerIds.add(jupSwapProgLogListenerId)

  logger.debug("START Processing Jup Limit Order Logs");
  const jupLimitOrderLogsCallback: LogsCallback = createLogsCallback(defiEventProcessor, 
    JUP_LIMIT_ORDER_PROGRAM_PK, LOG_COUNTER_LIMIT_BIG, stopListeningJupLimitOrder)
  jupLimitOrderProgLogListenerId = connection.onLogs(jupLimitOrderProgPk, jupLimitOrderLogsCallback, 'finalized');
  activeLogListenerIds.add(jupLimitOrderProgLogListenerId)

  logger.debug("START Processing Marginfy Logs");
  const marginfyLogsCallback: LogsCallback = createLogsCallback(defiEventProcessor, 
    MARGINFY_PROGRAM_PK, LOG_COUNTER_LIMIT_BIG, stopListeningMarginfy)
  marginfyProgLogListenerId = connection.onLogs(marginfyProgPk, marginfyLogsCallback, 'finalized');
  activeLogListenerIds.add(marginfyProgLogListenerId)

  logger.debug("START Processing Orca Logs");
  const orcaLogsCallback: LogsCallback = createLogsCallback(defiEventProcessor, 
    ORCA_PROGRAM_PK, LOG_COUNTER_LIMIT_SMALL, stopListeningOrca)
  orcaProgLogListenerId = connection.onLogs(orcaProgPk, orcaLogsCallback, 'finalized');
  activeLogListenerIds.add(orcaProgLogListenerId)
}

function createLogsCallback(defiEventProcessor: DefiEventProcessor, programPk: string, logCounterLimit: number, stopper: { (): void }): LogsCallback {
  return (logs, _context) => {
    if (logs.signature == "1111111111111111111111111111111111111111111111111111111111111111") {
      return
    }
    logCallbackCounter++
    logger.debug(logCallbackCounter.toString())
    if (logCallbackCounter > logCounterLimit) {
      stopper()
      if (activeLogListenerIds.size == 0) {
        stopUpdates()
        logCallbackCounter = 0
      }
    }

    logger.debug(logs.signature);

    defiEventProcessor.processTx(logs.signature, [programPk])
  }
}

main()
