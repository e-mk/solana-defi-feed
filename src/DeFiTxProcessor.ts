import { Connection } from '@solana/web3.js';
import logger from './logger.js'
import IxProcessorFactory from './IxProcessorFactory.js';
import { addDeFiUpdateMessageToQueue } from './tgBot.js';

class DefiTxProcessor {
  private connection: Connection
  private ixProcessorFactory: IxProcessorFactory;

  constructor(connection: Connection, ixProcessorFactory: IxProcessorFactory) {
    this.ixProcessorFactory = ixProcessorFactory;
    this.connection = connection
  }

  public async processTx(txSignature: string, accountKeys: string[]) {

    const executedProgramPk = this.ixProcessorFactory.findExecutedDeFiProgramKey(accountKeys);

    logger.debug(executedProgramPk)

    if (!executedProgramPk) {
      logger.error("No Known DeFi Program found in the accountKeys array")
      return
    }

    const transactionDetail = await this.connection.getParsedTransaction(txSignature, {
      maxSupportedTransactionVersion: 0,
    });

    // logger.debug("--------------------------")
    // logger.debug(transactionDetail)
    // logger.debug("--------------------------")

    const parsedInstructions = transactionDetail?.transaction?.message.instructions;
    const parsedInnerInstructions = transactionDetail?.meta?.innerInstructions!!;

    let message = this.ixProcessorFactory.processAllTxIxDetails(parsedInstructions, parsedInnerInstructions, executedProgramPk)
    if (message) {

      if (transactionDetail?.meta?.err) {
        logger.debug(`OnChain Error in Tx with Sig: ${txSignature}`)
        message = `${message} FILED TX |`
      }

      addDeFiUpdateMessageToQueue(message)
    }
  }
}



export default DefiTxProcessor
