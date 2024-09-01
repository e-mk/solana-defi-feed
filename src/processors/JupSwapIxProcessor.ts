import {ParsedInnerInstruction, PartiallyDecodedInstruction, ParsedInstruction} from '@solana/web3.js';


import IxProcessor from "./IxProcessor.js";
import IxDataParser from '../IxDataParser.js';
import IxProcessorType from '../IxProcessorType.js';
import { IxDataType } from '../IxDataType.js';

class JupSwapIxProcessor extends IxProcessor {

  constructor(ixDataParser: IxDataParser, processorType: IxProcessorType) {
    super(ixDataParser, processorType)
  }
  
  public processAllIxs(
    parsedInstructions: (ParsedInstruction | PartiallyDecodedInstruction)[], 
    parsedInnerInstructions: ParsedInnerInstruction[]): string {
    let message = "| DEX : Jup"
    
    let IxProcessedMsg = this.processIxs(parsedInstructions)
    this.processInnerIxs(parsedInnerInstructions)

    return `${message} | ${IxProcessedMsg}`
  }

  private processIxs(parsedInstructions: (ParsedInstruction | PartiallyDecodedInstruction)[]): string {
    const JupSwapIxProcessor = this;

    let message = ""

    if (!parsedInstructions) {
      return ""
    }

    parsedInstructions.forEach(function (parsedIx) {
      if (parsedIx.programId.toString() == JupSwapIxProcessor.processorType && 'data' in parsedIx) {
        const parsedIxData = JupSwapIxProcessor.parseIxData(parsedIx.data, IxDataType.INSTRUCTION)
        // logger.debug(parsedIxData)
        if (parsedIxData.data?.routePlan) {
          message = `Event: Swap | In Amount: ${parsedIxData?.data?.inAmount} | Quoted Out Amount: ${parsedIxData?.data?.quotedOutAmount} |`
        }
      }
    })
    return message
  }

  private processInnerIxs(parsedInnerInstructions: ParsedInnerInstruction[]): string {
    const JupSwapIxProcessor = this;
    let message = "DEX : Jup"

    if (!parsedInnerInstructions) {
      return ""
    }

    parsedInnerInstructions.forEach(function (parsedInIx) {
      parsedInIx.instructions.forEach(function (ix) {
        if (ix.programId.toString() == JupSwapIxProcessor.processorType && 'data' in ix) {
          const parsedInnerIxData = JupSwapIxProcessor.parseIxData(ix.data, IxDataType.EVENT)
        }
      })
    })
    return message
  }
}

export default JupSwapIxProcessor