export interface SwapRow {
  icon: string;
  name: string;
  marketSizeUsd: string;
  marketSizeNative: string;
  totalBorrowedUsd: string;
  totalBorrowedNative: string;
  depositApy: string;
  depositDelta: number;
  borrowApy: string;
  borrowApyDelta: number;
  token: Token;
  cToken: cToken;
}

export interface Token {
  icon: string;
  name: string;
}

export interface cToken {
  name: string;
}

export interface Network {}

export interface Networks {
  mainnet: Network;
  rinkeby: Network;
}

export enum TokenName {
  BTC = "BTC",
  ETH = "ETH",
  USDT = "USDT",
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
}
