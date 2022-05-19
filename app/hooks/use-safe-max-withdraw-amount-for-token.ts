import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { safeMaxWithdrawAmountForToken } from "~/lib/tender";
import type { TokenPair } from "~/types/global";

export function useSafeMaxWithdrawAmountForToken(
  signer: JsonRpcSigner | undefined | null,
  supplyBalance: number,
  borrowLimit: number,
  totalBorrowed: number,
  comptrollerAddress: string,
  tokenPair: TokenPair
): number {
  let [safeMaxWithdrawAmount, setSafeMaxWithdrawAmountForToken] =
    useState<number>(0);

  useEffect(() => {
    if (!signer) {
      return;
    }

    safeMaxWithdrawAmountForToken(
      signer,
      borrowLimit,
      totalBorrowed,
      comptrollerAddress,
      tokenPair
    ).then((v) => {
      let maxValue: number = Math.min(supplyBalance, v);
      setSafeMaxWithdrawAmountForToken(maxValue);
    });
  }, [
    signer,
    supplyBalance,
    borrowLimit,
    totalBorrowed,
    comptrollerAddress,
    tokenPair,
  ]);

  return safeMaxWithdrawAmount;
}
