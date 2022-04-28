import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { getCurrentlyBorrowing } from "~/lib/tender";
import type { cToken, Token } from "~/types/global";

export function useCurrentlyBorrowing(
  signer: JsonRpcSigner | undefined | null,
  cToken: cToken,
  token: Token
): number {
  let [currentlyBorrowing, setCurrentlyBorrowing] = useState<number>(0);

  useEffect(() => {
    if (!signer) {
      return;
    }

    getCurrentlyBorrowing(signer, cToken, token).then((c: number) => {
      setCurrentlyBorrowing(c);
    });
  }, [signer, cToken, token]);

  return currentlyBorrowing;
}
