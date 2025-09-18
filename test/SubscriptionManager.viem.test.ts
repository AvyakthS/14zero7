import { expect } from "chai";
import { network } from "hardhat";

describe("SubscriptionManager with Viem", () => {
  let publicClient: any;
  let walletClient: any;
  let subManager: any;
  let usdc: any;

  before(async () => {
    const conn = await network.connect();
    publicClient = await conn.viem.getPublicClient();
    [walletClient] = await conn.viem.getWalletClients();

    // Deploy ERC20Mock (USDC)
    usdc = await conn.viem.deployContract("ERC20Mock", ["USD Coin", "USDC", 6]);
    await usdc.write.mint([walletClient.account.address, 100_000_000n]); // 100 USDC with 6 decimals

    // Deploy SubscriptionManager
    subManager = await conn.viem.deployContract("SubscriptionManager");
  });

  it("should create a subscription", async () => {
    await usdc.write.approve([subManager.address, 10_000_000n]); // 10 USDC
    await subManager.write.createSubscription([
      walletClient.account.address,
      usdc.address,
      10_000_000n,
      30n * 24n * 60n * 60n,
    ]);

    const active = await subManager.read.isActive([
      walletClient.account.address,
      walletClient.account.address,
    ]);

    expect(active).to.equal(true);
  });
});
