import { useState, useEffect } from "react";

export function useInterval(POLLING_RATE: number): number {
  let [buster, setBuster] = useState<number>(Date.now());

  useEffect(() => {
    let id = setInterval(() => setBuster(Date.now()), POLLING_RATE);
    return () => {
      clearInterval(id);
    };
  }, [POLLING_RATE]);

  return buster;
}
