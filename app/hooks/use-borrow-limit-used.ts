import { useState, useEffect } from "react";
import { getBorrowLimitUsed } from "~/lib/tender";

export function useBorrowLimitUsed(
  totalBorrowedAmount: number,
  borrowLimit: number,
  borrowedAmount: number
): string {
  let [borrowLimitUsed, setBorrowLimitUsed] = useState<string>("");

  useEffect(() => {
    if (!borrowedAmount || !borrowLimit) {
      return;
    }

    getBorrowLimitUsed(totalBorrowedAmount, borrowLimit).then((b) =>
      setBorrowLimitUsed(b)
    );
  }, [totalBorrowedAmount, borrowLimit, borrowedAmount]);

  return borrowLimitUsed;
}
