import { useState, useEffect } from "react";
import type { NetworkData, NetworkName } from "~/types/global";
import networks from "~/config/networks";

export function useNetworkData(chainId: number | undefined) {
  let [networkData, setNetworkData] = useState<NetworkData>();
  useEffect(() => {
    if (!chainId) {
      return;
    }

    let networkNames: string[] = Object.keys(networks);
    let networkName: NetworkName = networkNames.find(
      (name) => networks[name as NetworkName].ChainId === chainId
    ) as NetworkName;

    const networkData: NetworkData = networks[networkName];
    setNetworkData(networkData);
  }, [chainId]);
  return networkData;
}
