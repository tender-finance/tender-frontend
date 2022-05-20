import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { getMaxBorrowAmount, getMaxWithdrawAmount } from "~/lib/tender";
import type { TokenPair } from "~/types/global";

export function useMaxBorrowAmount(
  signer: JsonRpcSigner | null | undefined,
  borrowLimit: number,
  totalBorrowed: number,
  tokenPair: TokenPair
): number {
  let [maxBorrowAmount, setMaxBorrowAmount] = useState<number>(0);

  useEffect(() => {
    if (!signer || !tokenPair) {
      return;
    }

    getMaxBorrowAmount(signer, borrowLimit, totalBorrowed, tokenPair).then(
      (v) => setMaxBorrowAmount(v)
    );
  }, [signer, borrowLimit, totalBorrowed, tokenPair]);

  return maxBorrowAmount;
}
