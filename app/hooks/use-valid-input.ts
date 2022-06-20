import { useState, useEffect } from "react";

enum InputValidationDetail {
  NON_NUMERIC_INPUT = "Please enter a number",
  INSUFFICIENT_LIQUIDITY = "Insufficient liquidity",
  NEGATIVE_OR_ZERO = "Please enter a value",
}

export function useValidInput(
  inputValue: string,
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
      // Remove insignificant 0's
      let value = inputValue.replace(/^0+|0+$/g, "");

      // 0 pad values leading with a `.` to simplify checking for
      // value coercion while parsing later in this function
      value = value.indexOf(".") === 0 ? `0${value}` : value;

      // If trailing decimal, remove
      value =
        value.indexOf(".") === value.length - 1
          ? value.substring(0, value.length - 1)
          : value;

      let isNaNValue: boolean = isNaN(parseFloat(value));
      let isCoerced = parseFloat(value).toString() !== value;
      if (isNaNValue || isCoerced) {
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
  }, [inputValue, floor, ceil, borrowLimitUsed]);

  return [isValid, reason];
}
