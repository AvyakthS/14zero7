import { ethers } from "hardhat";

async function main() {
  const SubManager = await ethers.getContractFactory("SubscriptionManager");
  const subManager = await SubManager.deploy();
  await subManager.waitForDeployment();

  console.log("SubscriptionManager deployed to:", await subManager.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
