import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { safeMaxBorrowAmountForToken } from "~/lib/tender";
import type { TokenPair } from "~/types/global";

export function useSafeMaxBorrowAmountForToken(
  signer: JsonRpcSigner | undefined | null,
  borrowLimit: number,
  totalBorrowed: number,
  comptrollerAddress: string,
  tokenPair: TokenPair
): number {
  let [safeMaxBorrowAmount, setSafeMaxBorrowAmountForToken] =
    useState<number>(0);

  useEffect(() => {
    if (!signer) {
      return;
    }

    safeMaxBorrowAmountForToken(
      signer,
      borrowLimit,
      totalBorrowed,
      tokenPair
    ).then((v) => setSafeMaxBorrowAmountForToken(v));
  }, [signer, borrowLimit, totalBorrowed, comptrollerAddress, tokenPair]);

  return safeMaxBorrowAmount;
}
