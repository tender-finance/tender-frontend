import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect, useContext } from "react";
import { TenderContext } from "~/contexts/tender-context";
import { getAccountBorrowLimitInUsd } from "~/lib/tender";
import type { TokenPair } from "~/types/global";
import { useInterval } from "./use-interval";

export function useBorrowLimit(
  signer: JsonRpcSigner | undefined,
  comptrollerAddress: string,
  tokenPairs: TokenPair[]
): number {
  let [borrowLimit, setBorrowLimit] = useState<number>(0);

  let { currentTransaction } = useContext(TenderContext);
  let poll = useInterval(7_000);

  useEffect(() => {
    if (!signer || !tokenPairs) {
      return;
    }

    getAccountBorrowLimitInUsd(signer, comptrollerAddress, tokenPairs).then(
      (b) => setBorrowLimit(b)
    );
  }, [signer, comptrollerAddress, tokenPairs, poll, currentTransaction]);

  return borrowLimit;
}
