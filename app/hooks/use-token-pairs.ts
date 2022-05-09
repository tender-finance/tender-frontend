import { useState, useEffect } from "react";
import type { NetworkData, Token, cToken, TokenPair } from "~/types/global";

function generateTokenPairs(networkData: NetworkData): TokenPair[] {
  // TODO: Would this be cleaner networkData.Tokens was an array?
  let tokenSymbols: string[] = Object.keys(networkData.Tokens);

  let tokenPairs: (TokenPair | null)[] = tokenSymbols.map(
    (symbol: string): TokenPair | null => {
      const tokenData: Token = networkData.Tokens[symbol];

      let token: Token = networkData.Tokens[tokenData.symbol];
      let cToken: cToken = networkData.cTokens[tokenData.cTokenSymbol];
      let priceOracleAddress: string =
        networkData.PriceOracles[tokenData.symbol];

      // Useful logs to know when the config isn't right
      if (!token || !cToken || !priceOracleAddress) {
        console.error(
          `Missing token, cToken, or priceOracleAddress in config for ${symbol}.`
        );
        console.error("token: ", token);
        console.error("cToken: ", cToken);
        console.error("priceOracleAddress: ", priceOracleAddress);

        return null;
      }

      return {
        token: networkData.Tokens[tokenData.symbol],
        cToken: networkData.cTokens[tokenData.cTokenSymbol],
      };
    }
  );

  return tokenPairs.filter((p): p is TokenPair => p !== null);
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
