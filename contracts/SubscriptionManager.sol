// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract SubscriptionManager is ReentrancyGuard {
    struct Subscription {
        uint256 amount;       // Fee per interval
        uint256 interval;     // Duration in seconds
        uint256 nextPayment;  // Timestamp for next payment
        bool active;          // Status
    }

    // subscriber => creator => subscription details
    mapping(address => mapping(address => Subscription)) public subscriptions;

    event Subscribed(address indexed subscriber, address indexed creator, uint256 amount, uint256 interval);
    event Renewed(address indexed subscriber, address indexed creator, uint256 nextPayment);
    event Cancelled(address indexed subscriber, address indexed creator);

    /// @notice Create a new subscription
    function createSubscription(
        address creator,
        address token,
        uint256 amount,
        uint256 interval
    ) external nonReentrant {
        require(interval > 0, "Invalid interval");
        require(amount > 0, "Invalid amount");

        IERC20(token).transferFrom(msg.sender, creator, amount);

        subscriptions[msg.sender][creator] = Subscription({
            amount: amount,
            interval: interval,
            nextPayment: block.timestamp + interval,
            active: true
        });

        emit Subscribed(msg.sender, creator, amount, interval);
    }

    /// @notice Renew subscription if interval has passed
    function renewSubscription(address creator, address token) external nonReentrant {
        Subscription storage sub = subscriptions[msg.sender][creator];
        require(sub.active, "Not active");
        require(block.timestamp >= sub.nextPayment, "Too early");

        IERC20(token).transferFrom(msg.sender, creator, sub.amount);

        sub.nextPayment = block.timestamp + sub.interval;

        emit Renewed(msg.sender, creator, sub.nextPayment);
    }

    /// @notice Cancel subscription
    function cancelSubscription(address creator) external {
        Subscription storage sub = subscriptions[msg.sender][creator];
        require(sub.active, "Already inactive");

        sub.active = false;

        emit Cancelled(msg.sender, creator);
    }

    /// @notice Check subscription status
    function isActive(address subscriber, address creator) external view returns (bool) {
        return subscriptions[subscriber][creator].active;
    }
}
