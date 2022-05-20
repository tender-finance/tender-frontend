import { useState, useEffect } from "react";

export interface Details {
  label: string;
}

const NON_NUMERIC_INPUT: Details = {
  label: "Non-numeric input",
};

const INSUFFICIENT_LIQUIDITY: Details = {
  label: "Insufficient liquidity",
};

const NEGATIVE_OR_ZERO: Details = {
  label: "Please provide value",
};

export function useValidInputForBorrowLimitUsed(
  value: string,
  floor: number,
  borrowLimitUsed: number
): [boolean, Details | null] {
  let [isValid, setIsValid] = useState<boolean>(false);
  let [reason, setReason] = useState<Details | null>(null);

  useEffect(() => {
    // Reset reason on each run
    setReason(null);

    try {
      if (isNaN(parseFloat(value))) {
        setReason(NON_NUMERIC_INPUT);
        throw "NaN";
      }

      let v: number = parseFloat(value);

      if (v <= floor) {
        setReason(NEGATIVE_OR_ZERO);
        setIsValid(false);
      } else if (borrowLimitUsed >= 100) {
        setReason(INSUFFICIENT_LIQUIDITY);
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    } catch (e) {
      setIsValid(false);
    }
  }, [value, floor, borrowLimitUsed]);

  return [isValid, reason];
}
