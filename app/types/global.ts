export interface cToken {
  name: string;
  address: string;
  decimals: number;
  symbol: string;
}

export interface Token extends TokenConfig {
  priceInUsd: number;
}

export interface TokenConfig {
  symbol: string;
  icon: string;
  name: string;
  decimals: number;
  address: string;
  cToken: cToken;
  priceDecimals: number;
}

export interface NetworkData {
  ChainId: number;
  blockExplorerName: string;
  blockExplorerUrl: string;
  Contracts: {
    Comptroller: string;
    PriceOracle: string;
  };
  Tokens: {
    [key: string]: TokenConfig;
  };
}

export enum NetworkName {
  rinkeby = "rinkeby",
  metisStartdust = "metisStartdust",
  metisMainnet = "metisMainnet",
}

export type Networks = {
  [key in NetworkName]: NetworkData;
};

export interface TokenPair {
  token: Token;
  cToken: cToken;
}

export type TenderContext = {
  tokenPairs: TokenPair[];
  networkData: NetworkData;
  markets: Market[];
  currentTransaction: string | null;
  updateTransaction: Function;
  isWaitingToBeMined: boolean;
  setIsWaitingToBeMined: Function;
};

export type Market = {
  id: string;
  tokenPair: TokenPair;
  marketData: {
    depositApy: string;
    borrowApy: string;
    totalBorrowedUsd: number;
    marketSizeUsd: number;
  };
  walletBalance: number;
  supplyBalance: number;
  supplyBalanceInUsd: number;
  borrowBalance: number;
  borrowBalanceInUsd: number;
  borrowLimit: number;
  borrowLimitUsedOfToken: string;
  borrowLimitUsed: string;
  totalBorrowedAmountInUsd: number;
  comptrollerAddress: string;
  maxBorrowLiquidity: number;
};
