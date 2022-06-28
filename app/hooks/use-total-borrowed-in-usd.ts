import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect, useContext } from "react";
import { TenderContext } from "~/contexts/tender-context";
import { getTotalBorrowedInUsd } from "~/lib/tender";
import type { TokenPair } from "~/types/global";
import { useInterval } from "./use-interval";

export function useTotalBorrowedInUsd(
  signer: JsonRpcSigner | undefined,
  tokenPairs: TokenPair[]
): number {
  let [totalBorrowedAmountInUsd, setTotalBorrowedAmountInUsd] =
    useState<number>(0);

  let poll = useInterval(7_000);
  let { currentTransaction } = useContext(TenderContext);

  useEffect(() => {
    if (!signer) {
      return;
    }

    getTotalBorrowedInUsd(signer, tokenPairs).then((b) =>
      setTotalBorrowedAmountInUsd(b)
    );
  }, [signer, tokenPairs, poll, currentTransaction]);

  return totalBorrowedAmountInUsd;
}
