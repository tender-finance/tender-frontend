import { useState, useEffect } from "react";

export function useValidInput(
  value: string,
  floor: number,
  ciel: number
): boolean {
  let [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    try {
      if (isNaN(parseFloat(value))) {
        throw "NaN";
      }

      let v: number = parseFloat(value);

      if (v > floor && v <= ciel) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    } catch (e) {
      console.warn(`Invalid input`, e);
      setIsValid(false);
    }
  }, [value, floor, ciel]);

  return isValid;
}
