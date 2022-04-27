import { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { getBorrowLimit } from "~/lib/tender";
import { TokenPair } from "~/types/global";

export function useBorrowLimit(
  signer: JsonRpcSigner | undefined,
  comptrollerAddress: string,
  tokenPairs: TokenPair[]
): number {
  let [borrowLimit, setBorrowLimit] = useState<number>(0);

  useEffect(() => {
    if (!signer) {
      return;
    }

    getBorrowLimit(signer, comptrollerAddress, tokenPairs).then((b) =>
      setBorrowLimit(b)
    );
  }, [signer, comptrollerAddress, tokenPairs]);

  return borrowLimit;
}
