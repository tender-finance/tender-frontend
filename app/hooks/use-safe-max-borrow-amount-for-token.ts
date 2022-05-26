import { useState, useEffect } from "react";
import { safeMaxBorrowAmountForToken } from "~/lib/tender";
import type { TokenPair } from "~/types/global";

export function useSafeMaxBorrowAmountForToken(
  borrowLimit: number,
  totalBorrowed: number,
  comptrollerAddress: string,
  tokenPair: TokenPair
): number {
  let [safeMaxBorrowAmount, setSafeMaxBorrowAmountForToken] =
    useState<number>(0);

  useEffect(() => {
    safeMaxBorrowAmountForToken(borrowLimit, totalBorrowed, tokenPair).then(
      (v) => setSafeMaxBorrowAmountForToken(v)
    );
  }, [borrowLimit, totalBorrowed, comptrollerAddress, tokenPair]);

  return safeMaxBorrowAmount;
}
