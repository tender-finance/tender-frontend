import { useState, useEffect } from "react";
import type { NetworkData, TokenName, TokenPair } from "~/types/global";

import { tokenMetaData } from "~/config/tokenMetaData";

function generateTokenPairs(
  networkData: NetworkData,
  supportedTokenNames: TokenName[]
): TokenPair[] {
  return supportedTokenNames
    .filter((tokenName) => {
      return networkData.Tokens[tokenName];
    })
    .map((tokenName: TokenName): TokenPair => {
      const tokenMetaDatum = tokenMetaData[tokenName];

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
