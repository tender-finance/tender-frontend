import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect } from "react";
import { netApy as netApyFn } from "~/lib/apy-calculations";
import type { NetworkData, TokenPair } from "~/types/global";

export function useNetApy(
  signer: JsonRpcSigner | undefined,
  tokenPairs: TokenPair[],
  priceOracles: NetworkData["PriceOracles"]
) {
  let [netApy, setNetApy] = useState<number | null>(null);

  useEffect(() => {
    if (!signer) {
      return;
    }
    netApyFn(signer, tokenPairs, priceOracles).then((n) => setNetApy(n));
  }, [signer, tokenPairs, priceOracles]);

  return netApy;
}
