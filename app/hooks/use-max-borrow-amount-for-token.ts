import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { maxBorrowAmountForToken } from "~/lib/tender";
import type { TokenPair } from "~/types/global";

export function useMaxBorrowAmountForToken(
  signer: JsonRpcSigner | undefined | null,
  borrowLimit: number,
  totalBorrowed: number,
  comptrollerAddress: string,
  tokenPair: TokenPair
): number {
  let [maxBorrowAmount, setMaxBorrowAmountForToken] = useState<number>(0);

  useEffect(() => {
    if (!signer) {
      return;
    }

    maxBorrowAmountForToken(signer, borrowLimit, totalBorrowed, tokenPair).then(
      (v) => setMaxBorrowAmountForToken(v)
    );
  }, [signer, borrowLimit, totalBorrowed, comptrollerAddress, tokenPair]);

  return maxBorrowAmount;
}
