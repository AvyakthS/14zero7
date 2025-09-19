# Web3 Subscriptions Without Middlemen

## 🔹 Overview
A decentralized subscription engine using stablecoins (USDC/DAI).
Think **Stripe for Web3** — recurring payments, auto-renewals, and cancellations,
fully on-chain without centralized services.

## 🔹 Features
- Pay in stable ERC20 tokens
- Periodic pull model (creators auto-renew via decentralized automation)
- Cancel anytime, verify subscription status on-chain
- Modular for integration with dApps and creators

## 🔹 Tech Stack
- Solidity (contracts)
- Hardhat + TypeScript (testing & deployment)
- Viem (modern blockchain client)
- OpenZeppelin (ERC20 standards & security)

## 🔹 Usage
```bash
npm install
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.ts --network localhost
