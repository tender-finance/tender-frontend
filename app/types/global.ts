export interface cToken {
  name: string;
  address: string;
  decimals: number;
  symbol: string;
}

export interface Token {
  symbol: string;
  icon: string;
  name: string;
  decimals: number;
  address: string;
  cToken: cToken;
  priceOracleAddress: string;
}

export interface NetworkData {
  ChainId: number;
  Contracts: {
    Comptroller: string;
  };
  Tokens: {
    [key: string]: Token;
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
};

export type Market = {
  id: string;
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
  borrowLimitUsedOfToken: string;
  borrowLimitUsed: string;
  totalBorrowedAmountInUsd: number;
  comptrollerAddress: string;
};

export enum InputValidationDetail {
  NON_NUMERIC_INPUT = "Non-numeric input",
  INSUFFICIENT_LIQUIDITY = "Insufficient liquidity",
  NEGATIVE_OR_ZERO = "Please provide value",
}
