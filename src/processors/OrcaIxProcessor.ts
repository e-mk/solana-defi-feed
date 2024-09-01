import { ParsedInnerInstruction, PartiallyDecodedInstruction, ParsedInstruction } from '@solana/web3.js';


import IxProcessor from "./IxProcessor.js";
import IxDataParser from '../IxDataParser.js';
import IxProcessorType from '../IxProcessorType.js';
import { IxDataType } from '../IxDataType.js';

class OrcaIxProcessor extends IxProcessor {

  constructor(ixDataParser: IxDataParser, processorType: IxProcessorType) {
    super(ixDataParser, processorType)
  }
  
  public processAllIxs(
    parsedInstructions: (ParsedInstruction | PartiallyDecodedInstruction)[], 
    parsedInnerInstructions: ParsedInnerInstruction[]): string {
      let message = "| DEX : Orca"

      const ixProcessedMsg = this.processIxs(parsedInstructions)
      const innerIxProcessedMsg = this.processInnerIxs(parsedInnerInstructions)

      const combinedProcessedMessage = ixProcessedMsg + innerIxProcessedMsg
  
      if (combinedProcessedMessage) {
        return `${message} | ${combinedProcessedMessage}`
      }
      
      return null
  }

  public processIxs(parsedInstructions: (ParsedInstruction | PartiallyDecodedInstruction)[]): string {
    const orcaIxProcessor = this;

    let message = ""
    
    if (!parsedInstructions) {
      return ""
    }

    parsedInstructions.forEach(function (parsedIx) {
      if (parsedIx.programId.toString() == orcaIxProcessor.processorType && 'data' in parsedIx) {
        const parsedIxData = orcaIxProcessor.parseIxData(parsedIx.data, IxDataType.INSTRUCTION)
        if (parsedIxData?.name?.toString().includes("Liquidity")) {
            message = `Event: ${parsedIxData?.name} | Amount: ${parsedIxData?.data?.liquidityAmount} |`
            return;
          } else if (parsedIxData?.name?.toString().includes("swap") || parsedIxData?.name?.toString().includes("Swap")) {
            message = `Event: ${parsedIxData?.name} | Amount: ${parsedIxData?.data?.amount} |`
            return;
          } else {
            message = `Event: ${parsedIxData?.name} |`
          }
      }
    })
    return message
  }

  public processInnerIxs(parsedInnerInstructions: ParsedInnerInstruction[]): string {
    const orcaIxProcessor = this;
    let message = ""

    if (!parsedInnerInstructions) {
      return ""
    }

    parsedInnerInstructions.forEach(function (parsedInIx) {
      parsedInIx.instructions.forEach(function (ix)  {
        if (ix.programId.toString() == orcaIxProcessor.processorType && 'data' in ix) {
          const parsedInnerIxData = orcaIxProcessor.parseIxData(ix.data, IxDataType.INSTRUCTION)
          if (parsedInnerIxData?.name?.toString().includes("Liquidity")) {
            message = `Event: ${parsedInnerIxData?.name} | Amount: ${parsedInnerIxData?.data?.liquidityAmount} |`
            return;
          } else if (parsedInnerIxData?.name?.toString().includes("swap") || parsedInnerIxData?.name?.toString().includes("Swap")) {
            message = `Event: ${parsedInnerIxData?.name} | Amount: ${parsedInnerIxData?.data?.amount} |`
            return;
          } else {
            message = `Event: ${parsedInnerIxData?.name} |`
          }
        }
      })
    })
    return message
  }
}

export default OrcaIxProcessor