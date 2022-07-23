import { useState, useEffect } from "react";
import { Market, TenderContext } from "~/types/global";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";
import { useTokenPairs } from "./use-token-pairs";
import { useOnSupportedNetwork } from "./use-on-supported-network";
import { useNetworkData } from "./use-network-data";
import { useMarkets } from "./use-markets";
import { useInterval } from "./use-interval";
import { useWeb3Signer } from "./use-web3-signer";

export function useTenderContext() {
  let [currentTransaction, updateTransaction] = useState<string | null>(null);
  let [tenderContext, setTenderContext] = useState<TenderContext | null>();
  let [isWaitingToBeMined, setIsWaitingToBeMined] = useState<boolean>(false);
  const chainId = Web3Hooks.useChainId();
  let provider = Web3Hooks.useProvider();
  const signer = useWeb3Signer(provider);

  let networkData = useNetworkData(chainId);
  let onSupportedNetwork = useOnSupportedNetwork(chainId);

  let tokenPairs = useTokenPairs(signer, networkData, onSupportedNetwork);
  let pollingKey = useInterval(5_000);

  let markets: Market[] = useMarkets(
    signer,
    tokenPairs,
    networkData?.Contracts?.Comptroller
  );

  useEffect(() => {
    if (!signer || !chainId || !networkData) {
      return;
    }

    setTenderContext({
      tokenPairs,
      networkData,
      markets,
      currentTransaction,
      updateTransaction,
      isWaitingToBeMined,
      setIsWaitingToBeMined
    });
  }, [
    signer,
    pollingKey,
    chainId,
    tokenPairs,
    networkData,
    markets,
    currentTransaction,
    isWaitingToBeMined
  ]);

  return tenderContext;
}
