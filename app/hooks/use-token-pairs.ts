import { useState, useEffect } from "react";
import type { NetworkData, Token, TokenPair } from "~/types/global";

function generateTokenPairs(networkData: NetworkData): TokenPair[] {
  // TODO: Would this be cleaner networkData.Tokens was an array?
  let tokenSymbols: string[] = Object.keys(networkData.Tokens);

  return tokenSymbols.map((symbol: string): TokenPair => {
    const tokenData: Token = networkData.Tokens[symbol];

    return {
      token: networkData.Tokens[tokenData.symbol],
      cToken: networkData.cTokens[tokenData.cTokenSymbol],
    };
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
