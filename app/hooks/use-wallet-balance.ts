import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { getWalletBalance } from "~/lib/tender";
import type { Token } from "~/types/global";

export function useWalletBalance(
  signer: JsonRpcSigner | undefined,
  token: Token
): number {
  let [walletBalance, setWalletBalance] = useState<number>(0);

  useEffect(() => {
    if (!signer) {
      return;
    }

    getWalletBalance(signer, token).then((b) => setWalletBalance(b));
  }, [signer, token]);

  return walletBalance;
}
