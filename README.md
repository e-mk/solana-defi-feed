## Table of Contents
- [About](#-about)
- [Main Challenges](#-challanges)
- [To See It In Action](#-in-action)
- [Future Improvements ](#-improvements)

## About
This repository is designed to demonstrate techniques for monitoring Solana transactions in several DEXs and converting them into a notification feed that provides detailed information about the events that occur.

Currently, the repo supports three DeFi protocols: Jupiter, Orca, and Marginfi. Each protocol has its own unique implementation. For example, Jupiter uses different Solana programs for various actions like Swap or Limit Order, while Orca operates with a single, comprehensive program that handles multiple instructions.

The application logic is organized into three main parts:

- **Fetching Transactions**: Transactions are retrieved from the chain using the `createLogsCallback()` method from the `solana/web3.js` library. First getting logs for Tx then polling the Tx info by Signature
- **Parsing Transactions and Instructions**: Parsing contains more complex logic for each Solana program and is primarily handled within the `processors` and `IxDataParser.ts` files.
- **User Interface**: The application's notification feed is showcased through a Telegram bot.

## To See It In Action
Check out the deployed demo of the application by visiting [DefiFeedBot](https://t.me/DefiFeedBot).

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
