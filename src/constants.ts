import {PublicKey} from '@solana/web3.js';
import dotenv from 'dotenv'
dotenv.config()

export const HELIUS_RPC_URL = `${process.env.SOLFEED_HELIUS_RPC_URL}`
export const HELIUS_API_KEY = `${process.env.SOLFEED_HELIUS_API_KEY}`
export const TG_BOT_TOKEN = `${process.env.SOLFEED_TG_BOT_TOKEN}`
export const LOG_LEVEL = `${process.env.SOLFEED_LOG_LEVEL}`
export const BOT_UPDATE_MSG_BULK_SIZE = parseInt(process.env.SOLFEED_BOT_UPDATE_MSG_BULK_SIZE) || 5
export const LOG_COUNTER_LIMIT_BIG = parseInt(process.env.SOLFEED_LOG_COUNTER_LIMIT_BIG) || 30
export const LOG_COUNTER_LIMIT_SMALL = parseInt(process.env.SOLFEED_LOG_COUNTER_LIMIT_SMALL) || 5

export const JUP_SWAP_PROGRAM_PK = "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
export const JUP_LIMIT_ORDER_PROGRAM_PK = "j1o2qRpjcyUwEvwtcfhEQefh773ZgjxcVRry7LDqg5X"
export const MARGINFY_PROGRAM_PK = "MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA"
export const ORCA_PROGRAM_PK = "whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc"

export const jupSwapProgPk = new PublicKey(JUP_SWAP_PROGRAM_PK)
export const jupLimitOrderProgPk = new PublicKey(JUP_LIMIT_ORDER_PROGRAM_PK)
export const marginfyProgPk = new PublicKey(MARGINFY_PROGRAM_PK)
export const orcaProgPk = new PublicKey(ORCA_PROGRAM_PK)

export const INTERESTED_ACCOUNT_PK = ""