import { useState, useEffect } from "react";
import { getTotalSupplyBalanceInUsd } from "~/lib/tender";

export function useTotalSupplyBalanceInUsd() {
  let [totalSupplyBalanceInUsd, setTotalSupplyBalanceInUsd] =
    useState<number>(0);

  useEffect(() => {
    getTotalSupplyBalanceInUsd().then((v) => setTotalSupplyBalanceInUsd(v));
  }, []);

  return totalSupplyBalanceInUsd;
}
