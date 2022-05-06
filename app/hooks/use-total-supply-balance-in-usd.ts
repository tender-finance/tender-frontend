import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { getTotalSupplyBalanceInUsd } from "~/lib/tender";
import type { TokenPair } from "~/types/global";

export function useTotalSupplyBalanceInUsd(
  signer: JsonRpcSigner | undefined,
  tokenPairs: TokenPair[]
) {
  let [totalSupplyBalanceInUsd, setTotalSupplyBalanceInUsd] =
    useState<number>(0);

  useEffect(() => {
    if (!signer || tokenPairs.length === 0) {
      return;
    }

    getTotalSupplyBalanceInUsd(signer, tokenPairs).then((v) =>
      setTotalSupplyBalanceInUsd(v)
    );
  }, [signer, tokenPairs]);

  return totalSupplyBalanceInUsd;
}
