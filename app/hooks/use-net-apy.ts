import type { JsonRpcSigner } from "@ethersproject/providers";
import { useState, useEffect, useContext } from "react";
import { TenderContext } from "~/contexts/tender-context";
import { netApy as netApyFn } from "~/lib/apy-calculations";
import type { TokenPair } from "~/types/global";
import { useInterval } from "./use-interval";

export function useNetApy(
  signer: JsonRpcSigner | undefined,
  tokenPairs: TokenPair[]
) {
  let [netApy, setNetApy] = useState<number | null>(null);
  let { currentTransaction } = useContext(TenderContext);
  let poll = useInterval(10_000);

  useEffect(() => {
    if (!signer) {
      return;
    }
    netApyFn(signer, tokenPairs).then((n) => setNetApy(n));
  }, [signer, tokenPairs, poll, currentTransaction]);

  return netApy;
}
