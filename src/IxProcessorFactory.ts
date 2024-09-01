import { Program, AnchorProvider, Idl } from "@coral-xyz/anchor"
import { ParsedInnerInstruction, PublicKey , PartiallyDecodedInstruction, ParsedInstruction} from '@solana/web3.js';

import { JUP_LIMIT_ORDER_PROGRAM_PK, JUP_SWAP_PROGRAM_PK, MARGINFY_PROGRAM_PK, ORCA_PROGRAM_PK } from "./constants.js";
import logger from "./logger.js";
import IxDataParser from "./IxDataParser.js";
import IxProcessor from "./processors/IxProcessor.js";
import IxProcessorType from "./IxProcessorType.js";
import MarginfyIxProcessor from "./processors/MarginfyIxProcessor.js";
import JupSwapIxProcessor from "./processors/JupSwapIxProcessor.js";
import JupLimitOrderIxProcessor from "./processors/JupLimitOrderIxProcessor.js";
import OrcaIxProcessor from "./processors/OrcaIxProcessor.js";

class IxProcessorFactory {
  private provider: AnchorProvider;
  private jupSwapProcessor: IxProcessor;
  private jupLimitOrderProcessor: IxProcessor;
  private marginfyIxProcessor: IxProcessor;
  private orcaIxProcessor: IxProcessor;

  constructor(provider: AnchorProvider) {
    this.provider = provider
    this.initProcessors()
  }

  public async initProcessors() {
    const jupSwapIdl = await this.fetchIdl(JUP_SWAP_PROGRAM_PK)
    if (!jupSwapIdl) {
      logger.error(`JUP Swap Program IDL is null :: ${JUP_SWAP_PROGRAM_PK}`)
    } else {
      this.jupSwapProcessor = new JupSwapIxProcessor(new IxDataParser(jupSwapIdl), IxProcessorType.JUP_SWAP_PARSER);
    }

    const jupLimitOrderIdl = await this.fetchIdl(JUP_LIMIT_ORDER_PROGRAM_PK)
    if (!jupSwapIdl) {
      logger.error(`JUP Limit Order Program IDL is null :: ${JUP_LIMIT_ORDER_PROGRAM_PK}`)
    } else {
      this.jupLimitOrderProcessor = new JupLimitOrderIxProcessor(new IxDataParser(jupLimitOrderIdl), IxProcessorType.JUP_LIMIT_ORDER_PARSER);
    }
    
    const marginfyIdl = await this.fetchIdl(MARGINFY_PROGRAM_PK)
    if (!jupSwapIdl) {
      logger.error(`Marginfy Program IDL is null :: ${MARGINFY_PROGRAM_PK}`)
    } else {
      this.marginfyIxProcessor = new MarginfyIxProcessor(new IxDataParser(marginfyIdl), IxProcessorType.MARGINFY_PARSER);
    }

    const orcaIdl = await this.fetchIdl(ORCA_PROGRAM_PK)
    if (!jupSwapIdl) {
      logger.error(`Orca Program IDL is null :: ${ORCA_PROGRAM_PK}`)
    } else {
      this.orcaIxProcessor = new OrcaIxProcessor(new IxDataParser(orcaIdl), IxProcessorType.ORCA_PARSER);
    }
  }

  public processAllTxIxDetails(
    parsedInstructions: (ParsedInstruction | PartiallyDecodedInstruction)[],
    parsedInnerInstructions: ParsedInnerInstruction[],
    executedProgramPk: string) {

      const ixProcessor: IxProcessor = this.getProgramIxProcessorType(executedProgramPk)
      const notificationStr: string = ixProcessor.processAllIxs(parsedInstructions, parsedInnerInstructions)

      if (notificationStr) {
        logger.info(notificationStr)
        return notificationStr;
      } 
      return ""
  }

  public findExecutedDeFiProgramKey(accountKeys: string[]): string {
    if (accountKeys.includes(JUP_SWAP_PROGRAM_PK)) {
      return JUP_SWAP_PROGRAM_PK;
    } else if (accountKeys.includes(JUP_LIMIT_ORDER_PROGRAM_PK)) {
      return JUP_LIMIT_ORDER_PROGRAM_PK;
    } else if (accountKeys.includes(MARGINFY_PROGRAM_PK)) {
      return MARGINFY_PROGRAM_PK;
    } else if (accountKeys.includes(ORCA_PROGRAM_PK)) {
      return ORCA_PROGRAM_PK;
    } else {
      return undefined;
    }
  }

  private async fetchIdl(programId: string): Promise<Idl | null> {
    const programPk = new PublicKey(programId);
    const idl = await Program.fetchIdl(programPk, this.provider);
    // logger.debug(idl)
  
    return idl;
  }

  private getProgramIxProcessorType(parserProgramPk: string): IxProcessor | null {
    switch (parserProgramPk) {
      case IxProcessorType.JUP_SWAP_PARSER:
        return this.jupSwapProcessor
      case IxProcessorType.JUP_LIMIT_ORDER_PARSER:
        return this.jupLimitOrderProcessor
      case IxProcessorType.MARGINFY_PARSER:
        return this.marginfyIxProcessor
      case IxProcessorType.ORCA_PARSER:
        return this.orcaIxProcessor
      default:
        logger.error("Couldn't find corresponding parser")
        return null
    }
  }
}


export default IxProcessorFactory