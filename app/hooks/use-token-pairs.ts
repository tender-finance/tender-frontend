import { useState, useEffect } from "react";
import type { NetworkData, TokenName, TokenPair } from "~/types/global";

import { tokenMetaData } from "~/config/tokenMetaData";

function generateTokenPairs(
  networkData: NetworkData,
  supportedTokenNames: TokenName[]
): TokenPair[] {
  // TODO: Would this be cleaner networkDAta.Tokens was an array?
  let tokenSymbols: string[] = Object.keys(networkData.Tokens);

  return tokenSymbols.map((symbol: string): TokenPair => {
    const tokenMetaDatum = networkData.Tokens[symbol];

    return {
      token: networkData.Tokens[tokenMetaDatum.symbol],
      cToken: networkData.cTokens[tokenMetaDatum.cTokenSymbol],
    };
  });
}

export function useTokenPairs(
  networkData: NetworkData | null | undefined,
  supportedTokens: TokenName[],
  onSupportedNetwork: boolean
) {
  let [tokenPairs, setTokenPairs] = useState<TokenPair[]>([]);

  useEffect(() => {
    if (!onSupportedNetwork || !networkData) {
      return;
    }
    setTokenPairs(generateTokenPairs(networkData, supportedTokens));
  }, [onSupportedNetwork, networkData, supportedTokens]);

  return tokenPairs;
}
