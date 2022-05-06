import type { TokenMetaDatum } from "~/config/tokenMetaData";

export interface Token {
  symbol: TokenName;
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

// TODO: Consolidate Network & Network Data
export interface NetworkData {
  Contracts: {
    Comptroller: string;
  };

  Tokens: any;
  cTokens: any;
  PriceOracles: {
    [key in TokenName]: string;
  };
}

export interface Network extends NetworkData {}

export interface Networks {
  mainnet: Network;
  rinkeby: Network;
  ropsten: Network;
  auroraTestnet: Network;
  auroraMainnet: Network;
  auroraLocalnet: Network;
  metisTestnet: Network;
  metisMainnet: Network;
}

// TODO: Cleanup network type logic to be less repetitive
export type NetworkString =
  | "mainnet"
  | "rinkeby"
  | "ropsten"
  | "auroraTestnet"
  | "auroraMainnet"
  | "auroraLocalnet"
  | "metisTestnet"
  | "metisMainnet";

export enum TokenName {
  AAVE = "AAVE",
  BAT = "BAT",
  DAI = "DAI",
  ETH = "ETH",
  LINK = "LINK",
  PAX = "PAX",
  SUSHI = "SUSHI",
  TUSD = "TUSD",
  UNI = "UNI",
  USDC = "USDC",
  USDT = "USDT",
  WBTC = "WBTC",
  YFI = "YFI",
  ZRX = "ZRX",
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
  metisTestnet = 588,
  metisMainnet = 1088,
  auroraTestnet = 1313161555,
  auroraMainnet = 1313161554,
  auroraLocalnet = 1313161556,
}

export interface TokenPair {
  token: Token;
  cToken: cToken;
}

export type TenderContext = {
  tokenPairs: TokenPair[];
  networkData: NetworkData;
  markets: Market[];
};

export type Market = {
  id: string;
  tokenMetaData: TokenMetaDatum;
  tokenPair: TokenPair;
  marketData: {
    depositApy: string;
    borrowApy: string;
    totalBorrowedUsd: string;
    marketSizeUsd: string;
  };
  walletBalance: number;
  supplyBalance: number;
  supplyBalanceInUsd: number;
  borrowBalance: number;
  borrowBalanceInUsd: number;
  borrowLimit: number;
  borrowLimitUsed: string;
  totalBorrowedAmount: number;
  comptrollerAddress: string;
};
