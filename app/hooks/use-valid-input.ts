import { useState, useEffect } from "react";

import { InputValidationDetail } from "~/types/global";

export function useValidInput(
  value: string,
  floor: number,
  ceil: number
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

      if (v > floor && v <= ceil) {
        setIsValid(true);
      } else {
        if (v <= floor) {
          setReason(InputValidationDetail.NEGATIVE_OR_ZERO);
        }

        if (v > ceil) {
          setReason(InputValidationDetail.INSUFFICIENT_LIQUIDITY);
        }

        setIsValid(false);
      }
    } catch (e) {
      setIsValid(false);
    }
  }, [value, floor, ceil]);

  return [isValid, reason];
}
