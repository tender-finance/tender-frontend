import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { getAssetPriceInUsd } from "~/lib/tender";
import type { TokenPair } from "~/types/global";

export function useNewTotalBorrowedAmountInUsd(
  signer: JsonRpcSigner | null | undefined,
  tokenPair: TokenPair,
  currentTotalBorrowedInUsd: number,
  newTokenBorrowAmount: number
): number {
  let [newTotalBorrowedAmountInUsd, setNewTotalBorrowedAmountInUsd] =
    useState<number>(0);

  useEffect(() => {
    if (!signer || !tokenPair) {
      return;
    }

    getAssetPriceInUsd(signer, tokenPair.token.priceOracleAddress).then(
      (priceInUsd) => {
        let newBorrowAmountInUsd: number = newTokenBorrowAmount * priceInUsd;

        setNewTotalBorrowedAmountInUsd(
          currentTotalBorrowedInUsd + newBorrowAmountInUsd
        );
      }
    );
  }, [signer, tokenPair, currentTotalBorrowedInUsd, newTokenBorrowAmount]);

  return newTotalBorrowedAmountInUsd;
}
