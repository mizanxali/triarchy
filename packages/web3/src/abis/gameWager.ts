export const ABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'gameCode',
        type: 'string',
      },
    ],
    name: 'GameCanceled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'gameCode',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'winner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'prizeMoney',
        type: 'uint256',
      },
    ],
    name: 'GameComplete',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'gameCode',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'player1',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'wagerAmount',
        type: 'uint256',
      },
    ],
    name: 'GameCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldFee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newFee',
        type: 'uint256',
      },
    ],
    name: 'HouseFeeUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'gameCode',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'player2',
        type: 'address',
      },
    ],
    name: 'PlayerJoined',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'WithdrawComplete',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'allGameCodes',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'gameCode',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'compensatedPlayer',
        type: 'address',
      },
    ],
    name: 'cancelGame',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'gameCode',
        type: 'string',
      },
      {
        internalType: 'address',
        name: 'winner',
        type: 'address',
      },
    ],
    name: 'completeGame',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'gameCode',
        type: 'string',
      },
    ],
    name: 'createGame',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllGameCodes',
    outputs: [
      {
        internalType: 'string[]',
        name: '',
        type: 'string[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'gameCode',
        type: 'string',
      },
    ],
    name: 'getGame',
    outputs: [
      {
        components: [
          {
            internalType: 'string',
            name: 'gameCode',
            type: 'string',
          },
          {
            internalType: 'address',
            name: 'player1',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'player2',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'wagerAmount',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isActive',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'isComplete',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'winner',
            type: 'address',
          },
        ],
        internalType: 'struct GameWager.Game',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
    ],
    name: 'getPlayerStats',
    outputs: [
      {
        internalType: 'uint256',
        name: 'wins',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'losses',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'ethWon',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'ethWagered',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'houseFeePercent',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'gameCode',
        type: 'string',
      },
    ],
    name: 'joinGame',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newFeePercent',
        type: 'uint256',
      },
    ],
    name: 'setHouseFeePercent',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
