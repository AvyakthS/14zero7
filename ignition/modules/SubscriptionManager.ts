import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

interface SubscriptionManagerArgs {
  admin?: string;       // optional initial admin
  defaultToken?: string; // optional default stablecoin
}

const SubscriptionManagerModule = buildModule(
  "SubscriptionManagerModule",
  (m, args: SubscriptionManagerArgs = {}) => {
    const subManager = m.contract("SubscriptionManager", {
      args: [
        args.admin ?? undefined,
        args.defaultToken ?? undefined
      ]
    });

    return { subManager };
  }
);

export default SubscriptionManagerModule;
