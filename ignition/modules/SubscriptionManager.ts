import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SubscriptionManagerModule = buildModule("SubscriptionManagerModule", (m) => {
  const subManager = m.contract("SubscriptionManager");
  return { subManager };
});

export default SubscriptionManagerModule;
