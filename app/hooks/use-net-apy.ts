import { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { netApy as netApyFn } from "~/lib/apy-calculations";
import { TokenPair } from "~/types/global";

export function useNetApy(
  signer: JsonRpcSigner | undefined,
  tokenPairs: TokenPair[]
) {
  let [netApy, setNetApy] = useState<number>(0);

  useEffect(() => {
    if (!signer) {
      return;
    }
    netApyFn(signer, tokenPairs).then((n) => setNetApy(n));
  }, []);

  return netApy;
}
