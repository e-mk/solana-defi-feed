## Table of Contents
- [About](#about)
- [To See It In Action](#to-see-it-in-action)
- [Main Challenges](#main-challenges)
- [Future Improvements ](#future-improvements)
- [Build Your Own Bot](#build-your-own-bot)

## About
This repository is designed to demonstrate techniques for monitoring Solana transactions in several DEXs and converting them into a notification feed that provides detailed information about the events that occur.

Currently, the repo supports three DeFi protocols: Jupiter, Orca, and Marginfi. Each protocol has its own unique implementation. For example, Jupiter uses different Solana programs for various actions like Swap or Limit Order, while Orca operates with a single, comprehensive program that handles multiple instructions.

The application logic is organized into three main parts:

- **Fetching Transactions**: Transactions are retrieved from the chain using the `createLogsCallback()` method from the `solana/web3.js` library. First getting logs for Tx then polling the Tx info by Signature
- **Parsing Transactions and Instructions**: Parsing contains more complex logic for each Solana program and is primarily handled within the `processors` and `IxDataParser.ts` files.
- **User Interface**: The application's notification feed is showcased through a Telegram bot.

## To See It In Action
- Check out the deployed demo of the application by visiting Telegram [DefiFeedBot](https://t.me/DefiFeedBot).

## Main Challenges
- Ensuring consistent real-time data from the Solana blockchain presented several challenges. Various approaches were considered:
  1. **Polling**: More time-consuming to implement.
  2. **Solana WebSockets**: The current solution.
  3. **Helius Webhook API**: Was implemented and tested initially. Was limited by free plan credits.
  4. **Geyser Plugin**: Too complex and expensive given the time concerned.
     
- The inconsistency among DeFi protocols in the Solana ecosystem posed another challenge. Each protocol has its own transaction types and structures, requiring careful handling on a case-by-case basis.

## Future Improvements 
Given the time constraints, there are a few areas that could be further enhanced:

- **Enriched Notifications**: Currently, notification messages primarily indicate the type of event that occurred. Future versions could include more detailed information, such as the accounts involved and the tokens used, which would require additional logic and processing.
- **Filtering Logic**: Some DEXs are more active than others, making it difficult to get a clear overview from notifications. Implementing account-based filtering could help address this.
- **Testing**: Comprehensive testing is crucial for production-ready software. Adding tests, particularly for the critical parts of the code, would greatly improve the project's robustness.

## Build Your Own Bot

1. Install the dependencies:
   
    ```sh
    npm install
    ```
2. Set up the configuration file:
    
    > Change `.env` file with the following variables:
    
    ```dosini
    SOLFEED_TG_BOT_TOKEN=<Your new Telegram bot token>
    SOLFEED_HELIUS_API_KEY=<Helius API key>
    SOLFEED_HELIUS_RPC_URL=<Helius RPC to connect>
    SOLFEED_LOG_LEVEL=<Log level>
    LOG_COUNTER_LIMIT_BIG=<Count of allowed Txs for less active DEXs>
    LOG_COUNTER_LIMIT_SMALL=<Count of allowed Txs for more active DEXs>
    SOLFEED_BOT_UPDATE_MSG_BULK_SIZE=<Count of events in one Tg message>
    ```
3. Build
    ```sh
    npm run build
    ```
4. Run 
 + in Development environment
   ```sh
   npm run dev
   ```
 + in Prod environment
   ```sh
   npm run start
   ```
