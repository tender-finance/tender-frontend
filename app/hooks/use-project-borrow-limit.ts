import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { projectBorrowLimit } from "~/lib/tender";
import type { TokenPair, cToken } from "~/types/global";

export function useProjectBorrowLimit(
  signer: JsonRpcSigner | undefined | null,
  comptrollerAddress: string,
  tokenPairs: TokenPair[],
  tokenPair: TokenPair,
  value: string
): number {
  let [newBorrowLimit, setNewBorrowLimit] = useState<number>(0);

  useEffect(() => {
    if (!signer) {
      return;
    }

    projectBorrowLimit(
      signer,
      comptrollerAddress,
      tokenPairs,
      tokenPair,
      parseFloat(value)
    ).then((v) => setNewBorrowLimit(v));
  }, [signer, comptrollerAddress, tokenPairs, tokenPair, value]);

  return newBorrowLimit;
}
