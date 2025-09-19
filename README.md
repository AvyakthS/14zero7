# **Web3 Subscriptions Without Middlemen**

This project provides a fully on-chain, decentralized subscription engine for the Web3 ecosystem. It empowers creators and projects to offer recurring subscription plans using stable ERC20 tokens like USDC or DAI, eliminating the volatility and complexity associated with native tokens like ETH.

Think of it as a decentralized "Stripe for Web3 Subscriptions."

## **The Challenge**

Traditional digital subscriptions (Netflix, Spotify) are seamless. In Web3, they are often clunky, relying on:

* **Volatile Tokens:** Gas price spikes or token value dips can cause subscriptions to fail or become unexpectedly expensive.  
* **Off-Chain Processors:** Many solutions use centralized services, reintroducing the middlemen that Web3 aims to replace.

## **The Solution**

This SubscriptionManager smart contract provides a robust, fully on-chain solution that allows:

* **Creators** to define recurring payment plans in stablecoins.  
* **Users** to subscribe with a simple transaction, confident in the stability of their payments.  
* **Keepers** (automated bots or any third party) to trigger renewals for due subscriptions, with an optional incentive reward.

## **Core Features**

* **Stablecoin Powered:** All plans are priced in ERC20 tokens, protecting both creators and subscribers from market volatility.  
* **Fully On-Chain:** No centralized servers or off-chain logic required. Everything from plan creation to payment processing is handled by the smart contract.  
* **Automated Renewals:** Includes logic for anyone to trigger renewals for due subscriptions, making the system reliable.  
* **Keeper Incentives:** Creators can set a small percentage of the subscription fee as a reward for the address that calls the renew function, incentivizing a decentralized network of keepers.  
* **Clear Status Verification:** On-chain functions provide an easily verifiable status for any subscription (Active, Due, Canceled).  
* **Secure & Gas Optimized:** Built on OpenZeppelin's battle-tested contracts and optimized for efficiency.

## **Tech Stack**

* **Smart Contracts:** Solidity ^0.8.20  
* **Development Environment:** Hardhat v3  
* **Testing:** Node.js Test Runner
* **Blockchain Interaction:** Ethers.js v6  
* **Deployment:** Hardhat Ignition & .deploy script are both supported
* **Dependencies:** OpenZeppelin Contracts, TypeScript

## **Project Structure**

.  
├── contracts/  
│   ├── SubscriptionManager.sol   \# The core subscription logic contract.  
│   └── ERC20Mock.sol             \# A mock ERC20 token for testing.  
├── ignition/  
│   └── modules/  
│       └── SubscriptionManager.ts  \# Hardhat Ignition module for deployment.  
├── scripts/  
│   └── deploy.ts                 \# Deployment script.  
├── test/  
│   └── SubscriptionManager.test.ts \# Comprehensive test suite for the contract.  
├── .env.example                  \# Example environment file.  
├── hardhat.config.ts             \# Hardhat configuration file.  
└── package.json                  \# Project dependencies and scripts.

## **Getting Started**

### **Prerequisites**

* [Node.js](https://nodejs.org/en/) (v18 or higher)  
* [NPM](https://www.npmjs.com/) (comes with Node.js)

### **1\. Clone the Repository**

git clone \<your-repo-url\>  
cd web3-subscriptions-hardhat-v3

### **2\. Install Dependencies**

npm install

### **3\. Set Up Environment Variables**

Copy the example environment file and fill in your details.

cp .env.example .env

You will need to add:

* SEPOLIA\_RPC\_URL: An RPC endpoint for the Sepolia testnet from a provider like [Alchemy](https://www.alchemy.com/) or [Infura](https://www.infura.io/).  
* PRIVATE\_KEY: The private key of the wallet you want to use for deployment.  
* ETHERSCAN\_API\_KEY: An API key from [Etherscan](https://etherscan.io/) to verify your contract.

## **Usage**

### **Compile Contracts**

Compile the smart contracts to generate artifacts and TypeScript typings.

npx hardhat compile

### **Run a Local Node**

For local development and testing, run a Hardhat node in a separate terminal.

npx hardhat node

### **Run Tests**

Execute the comprehensive test suite against the local Hardhat network.

npx hardhat test

### **Deploy to a Network**

Deploy the SubscriptionManager contract to a specified network (e.g., localhost or sepolia).

**To deploy to the local node:**

npx hardhat run scripts/deploy.ts \--network localhost

**To deploy to the Sepolia testnet:**

npx hardhat run scripts/deploy.ts \--network sepolia

### **Verify Contract on Etherscan**

After deploying to a public network like Sepolia, you can verify it using the Hardhat Etherscan plugin. (Ensure your hardhat.config.ts and .env are configured correctly).

npx hardhat verify \--network sepolia \<DEPLOYED\_CONTRACT\_ADDRESS\>

## **License**

This project is licensed under the MIT License.
