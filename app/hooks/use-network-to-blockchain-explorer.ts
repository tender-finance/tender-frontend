import { useState, useEffect, useContext } from "react";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";
import { TenderContext } from "~/contexts/tender-context";

export function useBlockchainExplorer(): {
  blockExplorerUrl: string | null;
  blockExplorerName: string | null;
} {
  let [blockExplorerUrl, setBlockExplorerUrl] = useState<string | null>(null);
  let [blockExplorerName, setBlockExplorerName] = useState<string | null>(null);

  let { networkData } = useContext(TenderContext);

  let chainId = Web3Hooks.useChainId();

  useEffect(() => {
    if (!chainId) {
      return;
    }

    let { blockExplorerUrl, blockExplorerName } = networkData;
    setBlockExplorerName(blockExplorerName);
    setBlockExplorerUrl(blockExplorerUrl);
  }, [chainId]);

  return {
    blockExplorerUrl,
    blockExplorerName,
  };
}
