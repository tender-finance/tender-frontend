import { useState, useEffect } from "react";
import { NetworkData, TenderContext, NetworkString } from "~/types/global";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";
import networks from "~/config/networks";
import { chainIdToNetwork } from "~/connectors";

export function useTenderContext() {
  let [tenderContext, setTenderContext] = useState<TenderContext | null>();
  const chainId = Web3Hooks.useChainId();

  useEffect(() => {
    if (!chainId) {
      return;
    }

    const networkName = chainIdToNetwork[chainId] as NetworkString;
    const networkData: NetworkData = networks[networkName];
    networkData.Contracts.Comptroller;

    setTenderContext({
      tokenPairs: [],
      networkData: networkData,
    });
  }, []);

  return tenderContext;
}
