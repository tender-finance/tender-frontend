import { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { getTotalBorrowed } from "~/lib/tender";
import { TokenPair } from "~/types/global";

export function useTotalBorrowed(
  signer: JsonRpcSigner | undefined,
  tokenPairs: TokenPair[]
): number {
  let [totalBorrowedAmount, setTotalBorrowedAmount] = useState<number>(0);

  useEffect(() => {
    if (!signer) {
      return;
    }

    getTotalBorrowed(signer, tokenPairs).then((b) => setTotalBorrowedAmount(b));
  }, [signer, tokenPairs]);

  return totalBorrowedAmount;
}
