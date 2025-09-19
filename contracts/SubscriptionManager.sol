// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/IERC20Permit.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract SubscriptionManager {
    using SafeERC20 for IERC20;

    uint16 public constant BPS_DENOMINATOR = 10_000;

    struct Plan {
        address provider;
        address token;
        uint256 amount;
        uint32 period;
        uint16 rewardBps;
        bool active;
    }

    struct Subscription {
        uint64 nextPaymentTime;
        bool active;
    }

    uint256 public nextPlanId;
    mapping(uint256 => Plan) public plans;
    mapping(address => mapping(uint256 => Subscription)) public subscriptions;

    event PlanCreated(uint256 indexed planId, address indexed provider, address indexed token, uint256 amount, uint32 period, uint16 rewardBps);
    event PlanUpdated(uint256 indexed planId, uint256 amount, uint32 period, uint16 rewardBps, bool active);
    event Subscribed(address indexed subscriber, uint256 indexed planId, uint64 nextPaymentTime);
    event Renewed(address indexed subscriber, uint256 indexed planId, uint256 cycles, uint256 paidAmount, address indexed caller);
    event Canceled(address indexed subscriber, uint256 indexed planId);

    error NotProvider();
    error InvalidParam();
    error PlanInactive();
    error NotActive();
    error NothingDue();
    error PlanNotFound();

    modifier onlyProvider(uint256 planId) {
        if (plans[planId].provider != msg.sender) revert NotProvider();
        _;
    }

    function createPlan(
        address token,
        uint256 amount,
        uint32 period,
        uint16 rewardBps
    ) external returns (uint256 planId) {
        if (token == address(0) || amount == 0 || period == 0 || rewardBps > BPS_DENOMINATOR) revert InvalidParam();
        planId = ++nextPlanId;
        plans[planId] = Plan({
            provider: msg.sender,
            token: token,
            amount: amount,
            period: period,
            rewardBps: rewardBps,
            active: true
        });
        emit PlanCreated(planId, msg.sender, token, amount, period, rewardBps);
    }

    function setPlanActive(uint256 planId, bool active) external onlyProvider(planId) {
        Plan storage p = plans[planId];
        if (p.provider == address(0)) revert PlanNotFound();
        p.active = active;
        emit PlanUpdated(planId, p.amount, p.period, p.rewardBps, p.active);
    }

    function updatePlan(
        uint256 planId,
        uint256 amount,
        uint32 period,
        uint16 rewardBps
    ) external onlyProvider(planId) {
        if (amount == 0 || period == 0 || rewardBps > BPS_DENOMINATOR) revert InvalidParam();
        Plan storage p = plans[planId];
        if (p.provider == address(0)) revert PlanNotFound();
        p.amount = amount;
        p.period = period;
        p.rewardBps = rewardBps;
        emit PlanUpdated(planId, p.amount, p.period, p.rewardBps, p.active);
    }

    function subscribe(uint256 planId) external {
        _subscribe(msg.sender, planId);
    }

    function subscribeWithPermit(
        uint256 planId,
        uint256 value,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        Plan memory p = plans[planId];
        if (p.provider == address(0)) revert PlanNotFound();
        if (!p.active) revert PlanInactive();
        IERC20Permit(p.token).permit(msg.sender, address(this), value, deadline, v, r, s);
        _subscribe(msg.sender, planId);
    }

    function _subscribe(address payer, uint256 planId) private {
        Plan memory p = plans[planId];
        if (p.provider == address(0)) revert PlanNotFound();
        if (!p.active) revert PlanInactive();

        IERC20 token = IERC20(p.token);
        token.safeTransferFrom(payer, p.provider, p.amount);

        uint64 nextTime = uint64(block.timestamp + p.period);
        subscriptions[payer][planId] = Subscription({nextPaymentTime: nextTime, active: true});
        emit Subscribed(payer, planId, nextTime);
    }

    function renew(uint256 planId, address subscriber, uint32 maxCycles) external {
        Plan memory p = plans[planId];
        if (p.provider == address(0)) revert PlanNotFound();
        if (!p.active) revert PlanInactive();

        Subscription storage s = subscriptions[subscriber][planId];
        if (!s.active) revert NotActive();
        if (block.timestamp < s.nextPaymentTime) revert NothingDue();

        IERC20 token = IERC20(p.token);

        uint256 totalPaid;
        uint32 cycles;
        while (cycles < maxCycles && block.timestamp >= s.nextPaymentTime) {
            if (p.rewardBps == 0) {
                token.safeTransferFrom(subscriber, p.provider, p.amount);
            } else {
                uint256 reward = (p.amount * p.rewardBps) / BPS_DENOMINATOR;
                uint256 toProvider = p.amount - reward;
                if (reward > 0) {
                    token.safeTransferFrom(subscriber, msg.sender, reward);
                }
                token.safeTransferFrom(subscriber, p.provider, toProvider);
            }
            s.nextPaymentTime += p.period;
            totalPaid += p.amount;
            cycles += 1;
        }

        emit Renewed(subscriber, planId, cycles, totalPaid, msg.sender);
    }

    function cancel(uint256 planId) external {
        Subscription storage s = subscriptions[msg.sender][planId];
        if (!s.active) revert NotActive();
        s.active = false;
        emit Canceled(msg.sender, planId);
    }

    function isActive(address subscriber, uint256 planId) external view returns (bool) {
        return subscriptions[subscriber][planId].active;
    }

    function nextPaymentTimeOf(address subscriber, uint256 planId) external view returns (uint64) {
        return subscriptions[subscriber][planId].nextPaymentTime;
    }

    function status(address subscriber, uint256 planId) external view returns (uint8 code, uint64 nextTime) {
        Subscription memory s = subscriptions[subscriber][planId];
        if (s.nextPaymentTime == 0) {
            return (0, 0);
        }
        if (!s.active) {
            return (3, s.nextPaymentTime);
        }
        if (block.timestamp >= s.nextPaymentTime) {
            return (2, s.nextPaymentTime);
        }
        return (1, s.nextPaymentTime);
    }
}
