import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import type { TokenPair } from "~/types/global";

export function useNewTotalBorrowedAmountInUsd(
  tokenPair: TokenPair,
  currentTotalBorrowedInUsd: number,
  newTokenBorrowAmount: number
): number {
  let [newTotalBorrowedAmountInUsd, setNewTotalBorrowedAmountInUsd] =
    useState<number>(0);

  useEffect(() => {
    if (!tokenPair) {
      return;
    }

    let newBorrowAmountInUsd: number =
      newTokenBorrowAmount * tokenPair.token.priceInUsd;

    setNewTotalBorrowedAmountInUsd(
      currentTotalBorrowedInUsd + newBorrowAmountInUsd
    );
  }, [tokenPair, currentTotalBorrowedInUsd, newTokenBorrowAmount]);

  return newTotalBorrowedAmountInUsd;
}
