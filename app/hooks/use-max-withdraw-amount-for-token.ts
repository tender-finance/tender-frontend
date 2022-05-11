import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { maxWithdrawAmountForToken } from "~/lib/tender";
import { TokenPair } from "~/types/global";

export function useMaxWithdrawAmountForToken(
  signer: JsonRpcSigner | undefined | null,
  supplyBalance: number,
  borrowLimit: number,
  totalBorrowed: number,
  comptrollerAddress: string,
  tokenPair: TokenPair
): number {
  let [maxWithdrawAmount, setMaxWithdrawAmountForToken] = useState<number>(0);

  useEffect(() => {
    if (!signer) {
      return;
    }

    maxWithdrawAmountForToken(
      signer,
      borrowLimit,
      totalBorrowed,
      comptrollerAddress,
      tokenPair
    ).then((v) => {
      let maxValue: number = Math.min(supplyBalance, v);
      setMaxWithdrawAmountForToken(maxValue);
    });
  }, [signer, borrowLimit, totalBorrowed, comptrollerAddress, tokenPair]);

  return maxWithdrawAmount;
}
