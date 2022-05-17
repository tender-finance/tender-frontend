import { useState, useEffect } from "react";

interface Details {
  label: string;
  isNumeric: boolean;
}

export function useValidInput(
  value: string,
  floor: number,
  ceil: number
): [boolean, Details | null] {
  let [isValid, setIsValid] = useState<boolean>(false);
  let [reason, setReason] = useState<Details | null>(null);

  useEffect(() => {
    // Reset reason on each run
    setReason(null);

    try {
      if (isNaN(parseFloat(value))) {
        reason = {
          label: "Non-numeric input",
          isNumeric: false,
        };
        throw "NaN";
      }

      let v: number = parseFloat(value);

      if (v > floor && v <= ceil) {
        setIsValid(true);
      } else {
        if (v <= floor) {
          setReason({
            label: "Insufficient liquidity",
            isNumeric: true,
          });
        }

        if (v > ceil) {
          setReason({
            label: "Insufficient liquidity",
            isNumeric: true,
          });
        }

        setIsValid(false);
      }
    } catch (e) {
      setIsValid(false);
    }
  }, [value, floor, ceil]);

  return [isValid, reason];
}
