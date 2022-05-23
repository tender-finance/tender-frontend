import { useState, useEffect } from "react";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";

let chainIdToBlockStuff: {
  [chain: string]: {
    blockExplorerUrl: string;
    blockExplorerName: string;
  };
} = {
  "4": {
    blockExplorerName: "Etherscan",
    blockExplorerUrl: "https://rinkeby.etherscan.io/tx",
  },
  "1088": {
    blockExplorerName: "Metis Andromeda Explorer",
    blockExplorerUrl: "https://andromeda-explorer.metis.io/tx",
  },
  "588": {
    blockExplorerName: "Metis Stardust Explorer",
    blockExplorerUrl: "https://stardust-explorer.metis.io/tx",
  },
};
export function useBlockchainExplorer(): {
  blockExplorerUrl: string | null;
  blockExplorerName: string | null;
} {
  let [blockExplorerUrl, setBlockExplorerUrl] = useState<string | null>(null);
  let [blockExplorerName, setBlockExplorerName] = useState<string | null>(null);

  let chainId = Web3Hooks.useChainId();

  useEffect(() => {
    if (!chainId) {
      return;
    }

    let { blockExplorerUrl, blockExplorerName } = chainIdToBlockStuff[chainId];
    setBlockExplorerName(blockExplorerName);
    setBlockExplorerUrl(blockExplorerUrl);
  }, [chainId]);

  return {
    blockExplorerUrl,
    blockExplorerName,
  };
}
