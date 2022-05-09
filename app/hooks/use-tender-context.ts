import { useState, useEffect } from "react";
import { type Market, type TenderContext } from "~/types/global";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";
import { useTokenPairs } from "./use-token-pairs";
import { useOnSupportedNetwork } from "./use-on-supported-network";
import { useNetworkData } from "./use-network-data";
import { useMarkets } from "./use-markets";

export function useTenderContext() {
  let [tenderContext, setTenderContext] = useState<TenderContext | null>();
  const chainId = Web3Hooks.useChainId();
  let networkData = useNetworkData(chainId);
  let onSupportedNetwork = useOnSupportedNetwork(chainId);
  let tokenPairs = useTokenPairs(networkData, onSupportedNetwork);

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
      markets,
    });
  }, [chainId, tokenPairs, networkData, markets]);

  return tenderContext;
}
