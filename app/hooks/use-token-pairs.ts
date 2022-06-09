import { type JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { getAssetPriceInUsd } from "~/lib/tender";
import type {
  NetworkData,
  cToken,
  TokenPair,
  TokenConfig,
  Token,
} from "~/types/global";

async function generateTokenPair(
  signer: JsonRpcSigner,
  networkData: NetworkData,
  symbol: string
): Promise<TokenPair> {
  let token: TokenConfig = networkData.Tokens[symbol];
  let cToken: cToken = token.cToken;

  let priceInUsd = await getAssetPriceInUsd(
    signer,
    networkData.Contracts.PriceOracle,
    token.cToken,
    token as Token
  );

  return {
    token: {
      ...token,
      priceInUsd: priceInUsd,
    },
    cToken,
  };
}

function validTokenConfigs(
  networkData: NetworkData,
  tokenSymbols: string[]
): string[] {
  return tokenSymbols.filter((symbol) => {
    let token: TokenConfig = networkData.Tokens[symbol];

    // Useful logs to know when the config isn't right
    if (!token || !token.cToken) {
      console.error(`Missing token or cToken in config for ${symbol}.`);
      console.error("token: ", token);
      console.error("cToken: ", token.cToken);

      return false;
    }

    return true;
  });
}

async function generateTokenPairs(
  signer: JsonRpcSigner,
  networkData: NetworkData
): Promise<TokenPair[]> {
  if (!networkData.Contracts.PriceOracle) {
    console.error("Missing PriceOracle address in config");
    return [];
  }

  let tokenSymbols: string[] = Object.keys(networkData.Tokens);

  let validTokenSymbols: string[] = validTokenConfigs(
    networkData,
    tokenSymbols
  );

  let pairs: Promise<TokenPair>[] = validTokenSymbols.map(async (symbol) => {
    return await generateTokenPair(signer, networkData, symbol);
  });

  return await Promise.all(pairs);
}

export function useTokenPairs(
  signer: JsonRpcSigner | null | undefined,
  networkData: NetworkData | null | undefined,
  onSupportedNetwork: boolean
) {
  let [tokenPairs, setTokenPairs] = useState<TokenPair[]>([]);

  useEffect(() => {
    if (!signer || !onSupportedNetwork || !networkData) {
      return;
    }

    generateTokenPairs(signer, networkData).then((v) => setTokenPairs(v));
  }, [signer, onSupportedNetwork, networkData]);

  return tokenPairs;
}
