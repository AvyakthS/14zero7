import "dotenv/config";
import { test } from "node:test";
import assert from "node:assert/strict";
import { ethers } from "ethers";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// RPC and keys (use Hardhat local node by default)
const RPC_URL = process.env.RPC_URL ?? "http://127.0.0.1:8545";
const DEFAULT_FIRST_PK =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Hardhat first account (local only)
const DEFAULT_SECOND_PK =
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"; // Hardhat second account (local only)
const PRIVATE_KEY = process.env.PRIVATE_KEY ?? DEFAULT_FIRST_PK;
const CREATOR_PRIVATE_KEY = process.env.CREATOR_PRIVATE_KEY ?? DEFAULT_SECOND_PK;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const subscriber = new ethers.Wallet(PRIVATE_KEY, provider);
const creator = new ethers.Wallet(CREATOR_PRIVATE_KEY, provider);

// Read compiled artifacts from Hardhat
function readArtifact(name: string) {
  const artifactPath = path.join(
    __dirname,
    "..",
    "artifacts",
    "contracts",
    `${name}.sol`,
    `${name}.json`
  );
  const json = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  return {
    abi: json.abi,
    bytecode: json.bytecode as string
  };
}

test("end-to-end: plan, subscribe, renew, cancel", async (t) => {
  t.timeout(60_000);

  // Sanity: RPC reachable and subscriber funded
  const blockNumber = await provider.getBlockNumber();
  assert.ok(blockNumber >= 0);
  const bal = await provider.getBalance(await subscriber.getAddress());
  assert.ok(bal > 0n);

  // Load artifacts
  const erc20 = readArtifact("ERC20Mock");
  const subMgr = readArtifact("SubscriptionManager");

  // Deploy mock ERC20
  const ERC20Factory = new ethers.ContractFactory(erc20.abi, erc20.bytecode, subscriber);
  const usdc = await ERC20Factory.deploy("USD Coin", "USDC", 18);
  await usdc.waitForDeployment();

  // Mint to subscriber
  await (await usdc.mint(await subscriber.getAddress(), ethers.parseUnits("100", 18))).wait();

  // Deploy SubscriptionManager
  const SubFactory = new ethers.ContractFactory(subMgr.abi, subMgr.bytecode, subscriber);
  const subManager = await SubFactory.deploy();
  await subManager.waitForDeployment();

  // Creator creates a plan (10 USDC per 30 days, no reward)
  const period = 30n * 24n * 60n * 60n; // 30 days
  const amount = ethers.parseUnits("10", 18);
  const subManagerForCreator = subManager.connect(creator);
  const createPlanTx = await subManagerForCreator.createPlan(await usdc.getAddress(), amount, Number(period), 0);
  await createPlanTx.wait();
  const planId = 1n; // first plan

  // Approve unlimited tokens to SubscriptionManager
  await (await usdc.approve(await subManager.getAddress(), ethers.MaxUint256)).wait();

  // Subscribe (pays first cycle immediately)
  await (await subManager.subscribe(planId)).wait();

  // Provider received first payment
  const providerBal1 = await usdc.balanceOf(await creator.getAddress());
  assert.equal(providerBal1, amount);

  // Time travel to make renewal due
  await provider.send("evm_increaseTime", [Number(period)]);
  await provider.send("evm_mine", []);

  // Anyone can renew; let creator call it to simulate a keeper
  await (await subManagerForCreator.renew(planId, await subscriber.getAddress(), 1)).wait();

  // Provider received second payment
  const providerBal2 = await usdc.balanceOf(await creator.getAddress());
  assert.equal(providerBal2, amount * 2n);

  // Status should be active
  const status = await subManager.status(await subscriber.getAddress(), planId);
  assert.equal(status[0], 1); // Active

  // Cancel subscription
  await (await subManager.cancel(planId)).wait();
  const isActive = await subManager.isActive(await subscriber.getAddress(), planId);
  assert.equal(isActive, false);
});
