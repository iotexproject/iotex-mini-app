import { defineChain } from 'viem';

export const iotexTestnet = /*#__PURE__*/ defineChain({
  id: 4_690,
  name: 'IoTeX Testnet',
  network: 'iotex-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'IoTeX',
    symbol: 'IOTX',
  },
  rpcUrls: {
    default: {
      http: ['https://babel-api.testnet.iotex.io'],
      webSocket: ['wss://babel-api.testnet.iotex.io'],
    },
    public: {
      http: ['https://babel-api.testnet.iotex.io'],
      webSocket: ['wss://babel-api.testnet.iotex.io'],
    },
  },
  blockExplorers: {
    default: { name: 'IoTeXScan', url: 'https://testnet.iotexscan.io' },
  },
  contracts: {
    multicall3: {
      address: '0xb5cecD6894c6f473Ec726A176f1512399A2e355d',
    },
  },
  testnet: true,
});

export const iotex = /*#__PURE__*/ defineChain({
  id: 4_689,
  name: 'IoTeX',
  network: 'iotex',
  nativeCurrency: {
    decimals: 18,
    name: 'IoTeX',
    symbol: 'IOTX',
  },
  rpcUrls: {
    default: {
      http: ['https://babel-api.mainnet.iotex.io'],
      webSocket: ['wss://babel-api.mainnet.iotex.io'],
    },
    public: {
      http: ['https://babel-api.mainnet.iotex.io'],
      webSocket: ['wss://babel-api.mainnet.iotex.io'],
    },
  },
  blockExplorers: {
    default: { name: 'IoTeXScan', url: 'https://iotexscan.io' },
  },
  contracts: {
    multicall3: {
      address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    },
  },
});
