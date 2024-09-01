import { ParsedInnerInstruction, PartiallyDecodedInstruction, ParsedInstruction } from '@solana/web3.js';


import IxProcessor from "./IxProcessor.js";
import IxDataParser from '../IxDataParser.js';
import IxProcessorType from '../IxProcessorType.js';
import { IxDataType } from '../IxDataType.js';

class MarginfyIxProcessor extends IxProcessor {

  constructor(ixDataParser: IxDataParser, processorType: IxProcessorType) {
    super(ixDataParser, processorType)
  }
  
  public processAllIxs(
    parsedInstructions: (ParsedInstruction | PartiallyDecodedInstruction)[], 
    parsedInnerInstructions: ParsedInnerInstruction[]): string {
      let message = "| DEX : Marginfy"

      const ixProcessedMsg = this.processIxs(parsedInstructions)
      // const innerIxProcessedMsg = this.processInnerIxs(parsedInnerInstructions)

      const combinedProcessedMessage = ixProcessedMsg
  
      if (combinedProcessedMessage) {
        return `${message} | ${combinedProcessedMessage}`
      }
      
      return null
  }

  public processIxs(parsedInstructions: (ParsedInstruction | PartiallyDecodedInstruction)[]): string {
    const marginfyIxProcessor = this;

    if (!parsedInstructions) {
      return ""
    }
    
    let message = ""

    parsedInstructions.forEach(function (parsedIx) {
      if (parsedIx.programId.toString() == marginfyIxProcessor.processorType && 'data' in parsedIx) {
        const parsedIxData = marginfyIxProcessor.parseIxData(parsedIx.data, IxDataType.INSTRUCTION)
        if (parsedIxData?.name == 'lendingAccountDeposit' || parsedIxData?.name == "lendingAccountRepay" 
          || parsedIxData?.name == "lendingAccountWithdraw" || parsedIxData?.name == "lendingAccountBorrow") {
            message = `Event: ${parsedIxData?.name} | Amount: ${parsedIxData?.data?.amount} |`
            return;
          } else {
            message = `Event: ${parsedIxData?.name} |`
            return;
          }
      }
    })
    return message
  }

  public processInnerIxs(parsedInnerInstructions: ParsedInnerInstruction[]): string {
    const marginfyIxProcessor = this;
    let message = ""

    parsedInnerInstructions.forEach(function (parsedInIx) {
      parsedInIx.instructions.forEach(function (ix)  {
        if (ix.programId.toString() == marginfyIxProcessor.processorType && 'data' in ix) {
          const parsedInnerIxData = marginfyIxProcessor.parseIxData(ix.data, IxDataType.EVENT)
        }
      })
    })
    return message
  }
}

export default MarginfyIxProcessor