import { useState, useEffect } from "react";
import { NetworkData, TenderContext, NetworkString } from "~/types/global";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";
import { useTokenPairs } from "./use-token-pairs";
import { useOnSupportedNetwork } from "./use-on-supported-network";
import { useNetworkData } from "./use-network-data";
import { SUPPORTED_TOKENS } from "../components/swap-table";

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

  useEffect(() => {
    if (!chainId || !networkData) {
      return;
    }

    setTenderContext({
      tokenPairs,
      networkData,
    });
  }, [chainId, tokenPairs, networkData]);

  return tenderContext;
}
