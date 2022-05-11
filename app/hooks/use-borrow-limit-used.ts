import { useState, useEffect } from "react";
import { getBorrowLimitUsed } from "~/lib/tender";

export function useBorrowLimitUsed(
  borrowedAmount: number,
  borrowLimit: number
): string {
  let [borrowLimitUsed, setBorrowLimitUsed] = useState<string>("");

  useEffect(() => {
    if (!borrowLimit) {
      return;
    }

    getBorrowLimitUsed(borrowedAmount, borrowLimit).then((b) =>
      setBorrowLimitUsed(b)
    );
  }, [borrowedAmount, borrowLimit]);

  return borrowLimitUsed;
}
