import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { getBorrowedAmount } from "~/lib/tender";
import type { cToken, Token } from "~/types/global";

export function useBorrowedAmount(
  signer: JsonRpcSigner | undefined,
  cToken: cToken,
  token: Token
): number {
  let [borrowedAmount, setBorrowedAmount] = useState<number>(0);

  useEffect(() => {
    if (!signer) {
      return;
    }

    getBorrowedAmount(signer, cToken, token).then((b) => setBorrowedAmount(b));
  }, [signer, cToken]);

  return borrowedAmount;
}
