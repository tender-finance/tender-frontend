import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { getMaxWithdrawAmount } from "~/lib/tender";
import type { TokenPair } from "~/types/global";

export function useMaxWithdrawAmount(
  signer: JsonRpcSigner | null | undefined,
  comptrollerAddress: string,
  supplyBalance: number,
  borrowLimit: number,
  totalBorrowed: number,
  tokenPair: TokenPair
): number {
  let [maxWithdrawAmount, setMaxWithdrawAmount] = useState<number>(0);

  useEffect(() => {
    if (!signer || !tokenPair) {
      return;
    }

    getMaxWithdrawAmount(
      signer,
      comptrollerAddress,
      supplyBalance,
      borrowLimit,
      totalBorrowed,
      tokenPair
    ).then((v) => setMaxWithdrawAmount(v));
  }, [
    signer,
    comptrollerAddress,
    supplyBalance,
    borrowLimit,
    totalBorrowed,
    tokenPair,
  ]);

  return maxWithdrawAmount;
}
