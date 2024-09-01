import { Idl, BorshCoder, BorshInstructionCoder, Instruction } from "@coral-xyz/anchor"
import { bs58, base64 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import logger from './logger.js'

class IxDataParser {
  private idl: Idl
  
  constructor(idl: Idl) {
    this.idl = idl;
  }

  public parseIxEventData(data: string) {
    let buffer = Buffer.from(bs58.decode(data));
    //remove first 8 bytes for the event cpi
    buffer = buffer.subarray(8);

    const coder = new BorshCoder(this.idl);
    const args = coder.events.decode(base64.encode(buffer));
    // logger.debug(`Args :: ${JSON.stringify(args)}`);
  
    // const outputAmount = (new BN(args?.data?.inputAmount)).toString()
  
    return args?.data;
  }

  public parseIxData(data: string): Instruction | null {  
    const borshCoder = new BorshInstructionCoder(this.idl);
    const decodedIx = borshCoder.decode(data, 'base58')
  
    // logger.debug(decodedIx)

    if (decodedIx) {
      return decodedIx
    } else {
      logger.error(`could not decode Ix Data ${data}`)
      
    }

    return null 
  }
}

export default IxDataParser