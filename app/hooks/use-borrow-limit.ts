import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { getAccountBorrowLimitInUsd } from "~/lib/tender";
import type { TokenPair } from "~/types/global";

export function useBorrowLimit(
  signer: JsonRpcSigner | undefined,
  comptrollerAddress: string,
  tokenPairs: TokenPair[]
): number {
  let [borrowLimit, setBorrowLimit] = useState<number>(0);

  useEffect(() => {
    if (!signer || !tokenPairs) {
      return;
    }

    getAccountBorrowLimitInUsd(signer, comptrollerAddress, tokenPairs).then(
      (b) => setBorrowLimit(b)
    );
  }, [signer, comptrollerAddress, tokenPairs]);

  return borrowLimit;
}
