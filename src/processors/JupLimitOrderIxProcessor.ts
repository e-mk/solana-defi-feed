import { ParsedInnerInstruction, PartiallyDecodedInstruction, ParsedInstruction} from '@solana/web3.js';


import IxProcessor from "./IxProcessor.js";
import IxDataParser from '../IxDataParser.js';
import IxProcessorType from '../IxProcessorType.js';
import logger from '../logger.js';
import { IxDataType } from '../IxDataType.js';

class JupLimitOrderIxProcessor extends IxProcessor {

  constructor(ixDataParser: IxDataParser, processorType: IxProcessorType) {
    super(ixDataParser, processorType)
  }
  
  public processAllIxs(
    parsedInstructions: (ParsedInstruction | PartiallyDecodedInstruction)[], 
    parsedInnerInstructions: ParsedInnerInstruction[]): string | null {

      let message = "| DEX : Jup"
    
      const ixProcessedMsg = this.processIxs(parsedInstructions)
      const innerIxProcessedMsg = this.processInnerIxs(parsedInnerInstructions)

      const combinedProcessedMessage = ixProcessedMsg + innerIxProcessedMsg
  
      if (combinedProcessedMessage) {
        return `${message} | ${combinedProcessedMessage}`
      }
      
      return null
  }

  private processIxs(parsedInstructions: (ParsedInstruction | PartiallyDecodedInstruction)[]): string {
    const jupLimitOrderIxProcessor = this;

    if (!parsedInstructions) {
      return ""
    }

    let message = ""

    parsedInstructions.forEach(function (parsedIx) {
      if (parsedIx.programId.toString() == jupLimitOrderIxProcessor.processorType && 'data' in parsedIx) {
        const parsedIxData = jupLimitOrderIxProcessor.parseIxData(parsedIx.data, IxDataType.INSTRUCTION)
        if (parsedIxData.name) {
           message = `Ix: ${parsedIxData.name} |`
           return
        }
      }
    })
    return message
  }

  public processInnerIxs(parsedInnerInstructions: ParsedInnerInstruction[]): string {
    const jupLimitOrderIxProcessor = this;
    let message = ""

    if (!parsedInnerInstructions) {
      return ""
    }

    parsedInnerInstructions.forEach(function (parsedInIx) {
      parsedInIx.instructions.forEach(function (ix)  {
        if (ix.programId.toString() == jupLimitOrderIxProcessor.processorType && 'data' in ix) {
          const parsedInnerIxData = jupLimitOrderIxProcessor.parseIxData(ix.data, IxDataType.EVENT)
          if (parsedInnerIxData.taker) {
            message = `Event: Trade | Taker: ${parsedInnerIxData.taker} | Taking: ${parsedInnerIxData.takingAmount} | Making: ${parsedInnerIxData.makingAmount} |`
            return
          } else if (parsedInnerIxData.maker) {
            message = `Event: Create Order | Maker: ${parsedInnerIxData.maker} | Taking: ${parsedInnerIxData.takingAmount} | Making: ${parsedInnerIxData.makingAmount} |`  
            return
          } else {
            message = "Event: Cancel Order |"
            return
          }
        }
      })
    })
    return message
  }
}

export default JupLimitOrderIxProcessor