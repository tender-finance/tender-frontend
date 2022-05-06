import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { getTotalBorrowedInUsd } from "~/lib/tender";
import type { NetworkData, TokenPair } from "~/types/global";

export function useTotalBorrowedInUsd(
  signer: JsonRpcSigner | undefined,
  tokenPairs: TokenPair[],
  priceOracles: NetworkData["PriceOracles"]
): number {
  let [totalBorrowedAmountInUsd, setTotalBorrowedAmountInUsd] =
    useState<number>(0);

  useEffect(() => {
    if (!signer) {
      return;
    }

    getTotalBorrowedInUsd(signer, tokenPairs, priceOracles).then((b) =>
      setTotalBorrowedAmountInUsd(b)
    );
  }, [signer, tokenPairs, priceOracles]);

  return totalBorrowedAmountInUsd;
}
