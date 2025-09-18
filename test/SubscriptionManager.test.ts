import { expect } from "chai";
import { ethers } from "hardhat";

describe("SubscriptionManager", function () {
  it("should create and cancel a subscription", async () => {
    const [subscriber, creator] = await ethers.getSigners();

    // Deploy mock ERC20 (18 decimals to match parseUnits(..., 18))
    const ERC20 = await ethers.getContractFactory("ERC20Mock");
    const usdc = await ERC20.deploy("USD Coin", "USDC", 18);
    await usdc.waitForDeployment();

    // Mint to subscriber
    await usdc.mint(subscriber.address, ethers.parseUnits("100", 18));

    // Deploy subscription manager
    const SubManager = await ethers.getContractFactory("SubscriptionManager");
    const subManager = await SubManager.deploy();
    await subManager.waitForDeployment();

    // Approve tokens
    await usdc.connect(subscriber).approve(await subManager.getAddress(), ethers.parseUnits("10", 18));

    // Subscribe
    await subManager.connect(subscriber).createSubscription(
      creator.address,
      await usdc.getAddress(),
      ethers.parseUnits("10", 18),
      30 * 24 * 60 * 60
    );

    expect(await subManager.isActive(subscriber.address, creator.address)).to.equal(true);

    // Cancel
    await subManager.connect(subscriber).cancelSubscription(creator.address);
    expect(await subManager.isActive(subscriber.address, creator.address)).to.equal(false);
  });
});
