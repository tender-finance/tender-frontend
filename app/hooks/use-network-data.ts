import { useState, useEffect } from "react";
import { chainIdToNetwork } from "~/connectors";
import { NetworkData, NetworkString } from "~/types/global";
import networks from "~/config/networks";

export function useNetworkData(chainId: number | undefined) {
  let [networkData, setNetworkData] = useState<NetworkData>();
  useEffect(() => {
    if (!chainId) {
      return;
    }

    const networkName = chainIdToNetwork[chainId] as NetworkString;
    const networkData: NetworkData = networks[networkName];
    setNetworkData(networkData);
  }, [chainId]);
  return networkData;
}
