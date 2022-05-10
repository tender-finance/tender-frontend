import { support } from "cypress/types/jquery";
import { chain } from "cypress/types/lodash";
import { useState, useEffect } from "react";
import networks from "~/config/networks";
import { NetworkName } from "~/types/global";

// Reference ~/connectors/index.ts for chain mappings

function supportedChains(chainId: number): number[] {
  let networkNames: string[] = Object.keys(networks);

  return networkNames.map((name) => networks[name as NetworkName].ChainId);
}

function checkIfNetworkIsSupported(chainId: number): boolean {
  return supportedChains(chainId).indexOf(chainId) > -1;
}
export function useOnSupportedNetwork(chainId: number | undefined | null) {
  let [onSupportedChain, setOnSupportedChain] = useState<boolean>(false);
  useEffect(() => {
    if (!chainId) {
      setOnSupportedChain(false);
      return;
    }
    setOnSupportedChain(checkIfNetworkIsSupported(chainId));
  }, [chainId]);
  return onSupportedChain;
}
