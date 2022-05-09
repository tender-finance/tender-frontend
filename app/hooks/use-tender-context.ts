import { useState, useEffect } from "react";
import { type Market, type TenderContext, TokenName } from "~/types/global";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";
import { useTokenPairs } from "./use-token-pairs";
import { useOnSupportedNetwork } from "./use-on-supported-network";
import { useNetworkData } from "./use-network-data";
import { useMarkets } from "./use-markets";

// TODO: Move to config
// These are the tokens that we have price oracles for on Rinkeby
export const SUPPORTED_TOKENS = [
  // TokenName.AAVE,
  TokenName.BAT,
  TokenName.DAI,
  TokenName.ETH,
  // TokenName.LINK,
  // TokenName.PAX,
  // TokenName.SUSHI,
  // TokenName.TUSD,
  // TokenName.UNI,
  TokenName.USDC,
  // TokenName.USDT,
  TokenName.WBTC,
  // TokenName.YFI,
  // TokenName.ZRX,
];

export function useTenderContext() {
  let [tenderContext, setTenderContext] = useState<TenderContext | null>();
  const chainId = Web3Hooks.useChainId();
  let networkData = useNetworkData(chainId);
  let onSupportedNetwork = useOnSupportedNetwork(chainId);
  let tokenPairs = useTokenPairs(
    networkData,
    SUPPORTED_TOKENS,
    onSupportedNetwork
  );

  let markets: Market[] = useMarkets(
    tokenPairs,
    networkData?.Contracts?.Comptroller,
    networkData?.PriceOracles
  );

  useEffect(() => {
    if (!chainId || !networkData) {
      return;
    }

    setTenderContext({
      tokenPairs,
      networkData,

      // all suppported tokens U tokens supported by current workwork?
      markets,
    });
  }, [chainId, tokenPairs, networkData, markets]);

  return tenderContext;
}
