import { expect } from "chai";
import { createWalletClient, createPublicClient, http, parseUnits } from "viem";
import { hardhat } from "viem/chains";
import { before, describe, it } from "mocha";
import { deployContract } from "viem";

import SubscriptionManagerArtifact from "../artifacts/contracts/SubscriptionManager.sol/SubscriptionManager.json";
import ERC20MockArtifact from "../artifacts/contracts/ERC20Mock.sol/ERC20Mock.json";

let walletClient: ReturnType<typeof createWalletClient>;
let publicClient: ReturnType<typeof createPublicClient>;
let subManagerAddress: string;
let usdcAddress: string;

describe("SubscriptionManager with Viem", () => {
  before(async () => {
    // Public client (local Hardhat node)
    publicClient = createPublicClient({ chain: hardhat, transport: http() });

    // Wallet client (first Hardhat account)
    walletClient = createWalletClient({ chain: hardhat, transport: http() });

    // Deploy ERC20Mock (USDC)
    const usdc = await deployContract(walletClient, {
      abi: ERC20MockArtifact.abi,
      bytecode: ERC20MockArtifact.bytecode,
      account: walletClient.account,
      args: ["USD Coin", "USDC", 6],
    });
    usdcAddress = usdc;

    // Mint some tokens to the wallet
    await walletClient.writeContract({
      abi: ERC20MockArtifact.abi,
      address: usdcAddress,
      functionName: "mint",
      args: [walletClient.account, parseUnits("100", 6)],
    });

    // Deploy SubscriptionManager
    const subManager = await deployContract(walletClient, {
      abi: SubscriptionManagerArtifact.abi,
      bytecode: SubscriptionManagerArtifact.bytecode,
    });
    subManagerAddress = subManager;
  });

  it("should create a subscription", async () => {
    // Approve SubscriptionManager to spend USDC
    await walletClient.writeContract({
      abi: ERC20MockArtifact.abi,
      address: usdcAddress,
      functionName: "approve",
      args: [subManagerAddress, parseUnits("10", 6)],
    });

    // Create subscription
    await walletClient.writeContract({
      abi: SubscriptionManagerArtifact.abi,
      address: subManagerAddress,
      functionName: "createSubscription",
      args: [walletClient.account, usdcAddress, parseUnits("10", 6), 30 * 24 * 60 * 60],
    });

    // Check subscription status
    const active = await walletClient.readContract({
      abi: SubscriptionManagerArtifact.abi,
      address: subManagerAddress,
      functionName: "isActive",
      args: [walletClient.account, walletClient.account],
    });

    expect(active).to.equal(true);
  });
});
