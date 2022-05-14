import { useState, useEffect } from "react";

interface Details {
  label: string;
  isNumeric: boolean;
}

export function useValidInput(
  value: string,
  floor: number,
  ciel: number
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

      if (v > floor && v <= ciel) {
        setIsValid(true);
      } else {
        if (v <= floor) {
          setReason({
            label: "Insufficient liquidity",
            isNumeric: true,
          });
        }

        if (v > ciel) {
          setReason({
            label: "Insufficient liquidity",
            isNumeric: true,
          });
        }

        setIsValid(false);
      }
    } catch (e) {
      console.warn(`Invalid input`, e);
      setIsValid(false);
    }
  }, [value, floor, ciel]);

  return [isValid, reason];
}
