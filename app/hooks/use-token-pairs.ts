import { useState, useEffect } from "react";
import type { NetworkData, Token, cToken, TokenPair } from "~/types/global";

function generateTokenPair(
  networkData: NetworkData,
  symbol: string
): TokenPair {
  let token: Token = networkData.Tokens[symbol];
  let cToken: cToken = token.cToken;

  return {
    token,
    cToken,
  };
}

function validTokenConfigs(
  networkData: NetworkData,
  tokenSymbols: string[]
): string[] {
  return tokenSymbols.filter((symbol) => {
    let token: Token = networkData.Tokens[symbol];
    let cToken: cToken = token.cToken;
    let priceOracleAddress: string = networkData.PriceOracles[symbol];

    // Useful logs to know when the config isn't right
    if (!token || !cToken || !priceOracleAddress) {
      console.error(
        `Missing token, cToken, or priceOracleAddress in config for ${symbol}.`
      );
      console.error("token: ", token);
      console.error("cToken: ", cToken);
      console.error("priceOracleAddress: ", priceOracleAddress);

      return false;
    }

    return true;
  });
}

function generateTokenPairs(networkData: NetworkData): TokenPair[] {
  let tokenSymbols: string[] = Object.keys(networkData.Tokens);

  let validTokenSymbols: string[] = validTokenConfigs(
    networkData,
    tokenSymbols
  );

  return validTokenSymbols.map((symbol) => {
    return generateTokenPair(networkData, symbol);
  });
}

export function useTokenPairs(
  networkData: NetworkData | null | undefined,
  onSupportedNetwork: boolean
) {
  let [tokenPairs, setTokenPairs] = useState<TokenPair[]>([]);

  useEffect(() => {
    if (!onSupportedNetwork || !networkData) {
      return;
    }
    setTokenPairs(generateTokenPairs(networkData));
  }, [onSupportedNetwork, networkData]);

  return tokenPairs;
}
