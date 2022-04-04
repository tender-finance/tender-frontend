export interface SwapRow {
  icon: string;
  name: string;
  token: Token;
  cToken: cToken;
  comptrollerAddress: string;
}

export interface Token {
  icon: string;
  name: string;
  decimals: number;
  address: string;
}

export interface cToken {
  name: string;
  address: string;
  decimals: number;
}

export interface Network {}

export interface Networks {
  mainnet: Network;
  rinkeby: Network;
  ropsten: Network;
  auroraTestnet: Network;
  auroraMainnet: Network;
  auroraLocalnet: Network;
}

export enum TokenName {
  BTC = "BTC",
  ETH = "ETH",
  USDT = "USDT",
  DAI = "DAI",
}

export enum NetworkName {
  mainnet = 1,
  ropsten = 3,
  rinkeby = 4,
  goerli = 5,
  kovan = 42,
  xdai = 100,
  orchid = 30,
  orchidTestnet = 31,
  core = 99,
  sokol = 77,
  classic = 61,
  ubiq = 8,
  thundercore = 108,
  thundercoreTestnet = 18,
  lightstreams = 163,
  fuse = 122,
  matic = 137,
  maticMumbai = 80001,
  auroraTestnet = 1313161555,
  auroraMainnet = 1313161554,
  auroraLocalnet = 1313161556,
}

export interface SwapRowMarketData {
  [id: string]: SwapRowMarketDatum;
}

export interface SwapRowMarketDatum {
  id: string;
  depositApy: string;
  borrowApy: string;
  marketSizeUsd: string;
  totalBorrowedUsd: string;
}

export interface NetworkData {
  Contracts: {
    Comptroller: string;
  };

  Tokens: any;
  cTokens: any;
}

export interface TokenPair {
  token: Token;
  cToken: cToken;
}
