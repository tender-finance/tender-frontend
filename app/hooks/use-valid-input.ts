import { useState, useEffect } from "react";

import { InputValidationDetail } from "~/types/global";

export function useValidInput(
  value: string,
  floor: number,
  ceil: number,
  borrowLimitUsed: number
): [boolean, InputValidationDetail | null] {
  let [isValid, setIsValid] = useState<boolean>(false);
  let [reason, setReason] = useState<InputValidationDetail | null>(null);

  useEffect(() => {
    // Reset reason on each run
    setReason(null);

    try {
      if (isNaN(parseFloat(value))) {
        setReason(InputValidationDetail.NON_NUMERIC_INPUT);
        throw "NaN";
      }

      let v: number = parseFloat(value);

      if (v <= floor) {
        setReason(InputValidationDetail.NEGATIVE_OR_ZERO);
        setIsValid(false);
      } else if (v > ceil) {
        setReason(InputValidationDetail.INSUFFICIENT_LIQUIDITY);
        setIsValid(false);
      } else if (borrowLimitUsed >= 100) {
        setReason(InputValidationDetail.INSUFFICIENT_LIQUIDITY);
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    } catch (e) {
      setIsValid(false);
    }
  }, [value, floor, ceil, borrowLimitUsed]);

  return [isValid, reason];
}
