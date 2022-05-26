import { useState, useEffect, useContext } from "react";
import { TenderContext } from "~/contexts/tender-context";

export function useBlockchainExplorer(): {
  blockExplorerUrl: string | null;
  blockExplorerName: string | null;
} {
  let [blockExplorerUrl, setBlockExplorerUrl] = useState<string | null>(null);
  let [blockExplorerName, setBlockExplorerName] = useState<string | null>(null);

  let { networkData } = useContext(TenderContext);

  useEffect(() => {
    let { blockExplorerUrl, blockExplorerName } = networkData;
    setBlockExplorerName(blockExplorerName);
    setBlockExplorerUrl(blockExplorerUrl);
  }, [networkData]);

  return {
    blockExplorerUrl,
    blockExplorerName,
  };
}
