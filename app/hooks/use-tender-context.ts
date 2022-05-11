import { useState, useEffect } from "react";
import { type Market, type TenderContext } from "~/types/global";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";
import { useTokenPairs } from "./use-token-pairs";
import { useOnSupportedNetwork } from "./use-on-supported-network";
import { useNetworkData } from "./use-network-data";
import { useMarkets } from "./use-markets";
import { useInterval } from "./use-interval";

export function useTenderContext() {
  let [currentTransaction, updateTransaction] = useState<string | null>(null);
  let [tenderContext, setTenderContext] = useState<TenderContext | null>();
  const chainId = Web3Hooks.useChainId();
  let networkData = useNetworkData(chainId);
  let onSupportedNetwork = useOnSupportedNetwork(chainId);
  let tokenPairs = useTokenPairs(networkData, onSupportedNetwork);
  let pollingKey = useInterval(10_000);

  let markets: Market[] = useMarkets(
    tokenPairs,
    networkData?.Contracts?.Comptroller
  );

  useEffect(() => {
    if (!chainId || !networkData) {
      return;
    }

    setTenderContext({
      tokenPairs,
      networkData,
      markets,
      currentTransaction,
      updateTransaction,
    });
  }, [
    pollingKey,
    chainId,
    tokenPairs,
    networkData,
    markets,
    currentTransaction,
  ]);

  return tenderContext;
}
