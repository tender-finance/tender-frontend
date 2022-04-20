import { useState, useEffect } from "react";

// Reference ~/connectors/index.ts for chain mappings
const SUPPORTED_CHAINS: number[] = [1, 3, 4, 588, 1088];

function checkIfNetworkIsSupported(chainId: number): boolean {
  return SUPPORTED_CHAINS.indexOf(chainId) > -1;
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
