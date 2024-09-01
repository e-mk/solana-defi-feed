import { ParsedInnerInstruction, PartiallyDecodedInstruction, ParsedInstruction} from '@solana/web3.js';

import IxDataParser from "../IxDataParser.js"
import { IxDataType } from "../IxDataType.js";
import IxProcessorType from "../IxProcessorType.js";
import logger from '../logger.js';

abstract class IxProcessor {
  private ixDataParser: IxDataParser
  protected processorType: IxProcessorType

  constructor(ixDataParser: IxDataParser, processorType: IxProcessorType) {
    this.ixDataParser = ixDataParser;
    this.processorType = processorType;
  }

  public parseIxData(ixData: string, dataType: IxDataType) {
    let parsedIxData
    
    if (dataType == IxDataType.EVENT) {
      parsedIxData = this.ixDataParser.parseIxEventData(ixData)
    } else {
      parsedIxData = this.ixDataParser.parseIxData(ixData)
    }

    return parsedIxData;
  }

  public abstract processAllIxs(
    parsedInstructions: (ParsedInstruction | PartiallyDecodedInstruction)[], 
    parsedInnerInstructions: ParsedInnerInstruction[]) : string | null
}

export default IxProcessor