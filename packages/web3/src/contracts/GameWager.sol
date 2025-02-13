// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameWager {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    struct Game {
        string gameCode;
        address player1;
        address player2;
        uint256 wagerAmount;
        bool isActive;
        bool isComplete;
        address winner;
    }

    mapping(string => Game) public games;
    string[] public allGameCodes;
    mapping(address => uint256) public playerWins;
    mapping(address => uint256) public playerLosses;

    event GameCreated(string gameCode, address player1, uint256 wagerAmount);
    event PlayerJoined(string gameCode, address player2);
    event GameComplete(string gameCode, address winner, uint256 prizeMoney);
    event GameCanceled(string gameCode);
    event WithdrawComplete(address owner, uint256 amount);

    modifier gameExists(string memory gameCode) {
        require(games[gameCode].player1 != address(0), "Game does not exist");
        _;
    }

    function getGame(
        string memory gameCode
    ) external view returns (Game memory) {
        return games[gameCode];
    }

    function getAllGameCodes() external view returns (string[] memory) {
        return allGameCodes;
    }

    function createGame(string memory gameCode) external payable {
        require(msg.value > 0, "Wager amount must be greater than 0");
        require(
            games[gameCode].player1 == address(0),
            "Game code already exists"
        );

        games[gameCode] = Game({
            gameCode: gameCode,
            player1: msg.sender,
            player2: address(0),
            wagerAmount: msg.value,
            isActive: true,
            isComplete: false,
            winner: address(0)
        });

        allGameCodes.push(gameCode);

        emit GameCreated(gameCode, msg.sender, msg.value);
    }

    function joinGame(
        string memory gameCode
    ) external payable gameExists(gameCode) {
        Game storage game = games[gameCode];

        require(game.isActive, "Game is not active");
        require(game.player2 == address(0), "Game already has two players");
        require(msg.sender != game.player1, "Cannot join your own game");
        require(
            msg.value == game.wagerAmount,
            "Must match the exact wager amount"
        );

        game.player2 = msg.sender;

        emit PlayerJoined(gameCode, msg.sender);
    }

    function completeGame(
        string memory gameCode,
        address winner
    ) external onlyOwner gameExists(gameCode) {
        Game storage game = games[gameCode];

        require(game.isActive, "Game is not active");
        require(!game.isComplete, "Game is already complete");
        require(game.player2 != address(0), "Game needs two players");
        require(
            winner == game.player1 || winner == game.player2,
            "Winner must be one of the players"
        );

        game.isActive = false;
        game.isComplete = true;
        game.winner = winner;

        playerWins[winner]++;
        playerLosses[winner == game.player1 ? game.player2 : game.player1]++;

        uint256 totalWager = game.wagerAmount * 2;
        uint256 prizeMoney = (totalWager * 80) / 100;
        payable(winner).transfer(prizeMoney);

        emit GameComplete(gameCode, winner, prizeMoney);
    }

    function cancelGame(
        string memory gameCode,
        address compensatedPlayer
    ) external onlyOwner gameExists(gameCode) {
        Game storage game = games[gameCode];
        require(game.isActive, "Game is not active");
        require(
            compensatedPlayer == game.player1 ||
                compensatedPlayer == game.player2,
            "Compensated player must be one of the players"
        );

        game.isActive = false;
        game.isComplete = true;

        payable(compensatedPlayer).transfer(game.wagerAmount);

        emit GameCanceled(gameCode);
    }

    function getPlayerStats(
        address player
    ) external view returns (uint256 wins, uint256 losses) {
        return (playerWins[player], playerLosses[player]);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        payable(owner).transfer(balance);

        emit WithdrawComplete(owner, balance);
    }
}
