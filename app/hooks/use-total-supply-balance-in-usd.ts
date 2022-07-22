import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect, useContext } from "react";
import { TenderContext } from "~/contexts/tender-context";
import { getTotalSupplyBalanceInUsd } from "~/lib/tender";
import type { TokenPair } from "~/types/global";
import { useInterval } from "./use-interval";

export function useTotalSupplyBalanceInUsd(
  signer: JsonRpcSigner | undefined,
  tokenPairs: TokenPair[]
) {
  let [totalSupplyBalanceInUsd, setTotalSupplyBalanceInUsd] =
    useState<number>(0);
  let { currentTransaction } = useContext(TenderContext);
  let poll = useInterval(7_000);

  useEffect(() => {
    if (!signer || tokenPairs.length === 0) {
      return;
    }

    getTotalSupplyBalanceInUsd(signer, tokenPairs).then((v) =>
      setTotalSupplyBalanceInUsd(v)
    );
  }, [signer, tokenPairs, poll, currentTransaction]);

  return totalSupplyBalanceInUsd;
}
