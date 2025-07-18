// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameReferrals {
    // Mapping to store referral counts for each wallet address
    mapping(address => uint256) private referralCounts;

    // Mapping to store total earnings for each wallet address
    mapping(address => uint256) private totalEarnings;

    // Array to keep track of all users who have received referrals
    address[] private allUsers;

    // Mapping to check if a user has been added to the array
    mapping(address => bool) private userExists;

    // Event emitted when a referral is added
    event ReferralAdded(
        address indexed user,
        uint256 newCount,
        uint256 wagerAmount,
        uint256 reward
    );

    // Owner of the contract (optional, for access control)
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    // Modifier to restrict access to owner only (optional)
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    /**
     * @dev Increment referral count for a specific user and transfer 20% of wager amount
     * @param user The wallet address to increment referrals for
     * @param wagerAmount The amount wagered that triggers this referral
     */
    function incrementReferral(
        address user,
        uint256 wagerAmount
    ) external payable onlyOwner {
        require(user != address(0), "Invalid user address");
        require(wagerAmount > 0, "Wager amount must be greater than 0");

        // Calculate 20% of wager amount
        uint256 reward = (wagerAmount * 20) / 100;

        // Increment referral count
        referralCounts[user] += 1;

        // Add to total earnings
        totalEarnings[user] += reward;

        // Add user to array if not already exists
        if (!userExists[user]) {
            allUsers.push(user);
            userExists[user] = true;
        }

        // Transfer 20% to the user from the sent ETH
        payable(user).transfer(reward);

        // Return any excess ETH to owner
        if (msg.value > reward) {
            payable(owner).transfer(msg.value - reward);
        }

        emit ReferralAdded(user, referralCounts[user], wagerAmount, reward);
    }

    /**
     * @dev Get referral count and total earnings for a specific user
     * @param user The wallet address to check
     * @return referralCount The number of referrals for the user
     * @return earnings The total earnings accumulated by the user
     */
    function getReferralCount(
        address user
    ) external view returns (uint256 referralCount, uint256 earnings) {
        return (referralCounts[user], totalEarnings[user]);
    }

    /**
     * @dev Get referral count and total earnings for the caller
     * @return referralCount The number of referrals for msg.sender
     * @return earnings The total earnings accumulated by msg.sender
     */
    function getMyReferralCount()
        external
        view
        returns (uint256 referralCount, uint256 earnings)
    {
        return (referralCounts[msg.sender], totalEarnings[msg.sender]);
    }

    /**
     * @dev Get all users with their referral counts and earnings
     * @return users Array of user addresses
     * @return counts Array of referral counts corresponding to users
     * @return earnings Array of total earnings corresponding to users
     */
    function getAllReferralData()
        external
        view
        returns (
            address[] memory users,
            uint256[] memory counts,
            uint256[] memory earnings
        )
    {
        uint256 userCount = allUsers.length;

        users = new address[](userCount);
        counts = new uint256[](userCount);
        earnings = new uint256[](userCount);

        for (uint256 i = 0; i < userCount; i++) {
            users[i] = allUsers[i];
            counts[i] = referralCounts[allUsers[i]];
            earnings[i] = totalEarnings[allUsers[i]];
        }

        return (users, counts, earnings);
    }

    /**
     * @dev Get total number of unique users with referrals
     * @return The total number of users who have received referrals
     */
    function getTotalUsersCount() external view returns (uint256) {
        return allUsers.length;
    }

    /**
     * @dev Transfer ownership of the contract
     * @param newOwner The address of the new owner
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }

    /**
     * @dev Withdraw any accidentally sent funds from the contract
     * @param amount The amount to withdraw
     */
    function withdraw(uint256 amount) external onlyOwner {
        require(
            amount <= address(this).balance,
            "Insufficient contract balance"
        );
        payable(owner).transfer(amount);
    }

    /**
     * @dev Get contract balance
     * @return The current balance of the contract
     */
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
