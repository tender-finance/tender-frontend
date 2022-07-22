import { roundNumber } from "./tender"
import * as HRNumbers from "human-readable-numbers";

const DEFAULT_TEXT_CLASS = "sm:text-6xl";


/**
 * Used on deposit, withdraw, borrow, and repay modals
 *
 * @param len Lenght of input value
 * @returns corresponding tailwind text size class
 */
const shrinkyInputClass = (len: number): string => {
  let className = DEFAULT_TEXT_CLASS;

  if (len > 22) {
    className = "text-md";
  } else if (len > 19) {
    className = "text-lg";
  } else if (len > 17) {
    className = "text-xl";
  } else if (len > 15) {
    className = "text-2xl";
  } else if (len > 12) {
    className = "text-3xl";
  } else if (len > 9) {
    className = "text-4xl";
  } else if (len > 7) {
    className = "sm:text-5xl";
  }
  return className;
};

/**
 *
 * @param v Number to round
 * @param withPrefix Indicates weather to include currency prefix (i.e. $)
 * @returns A number that's rounded and localized
 */
export const toFiatString = (v: number): string => {
  let roundedNumber = parseFloat(v.toFixed(2));
  return `${roundedNumber.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })}`;
};

const A_BIG_NUMBER = 100000;
export const toShortFiatString = (v: number): string => {
  return `${v > A_BIG_NUMBER ? HRNumbers.toHumanString(v) : toFiatString(v)}`;
};

export const toShortCryptoString = (v: number): string => {
  return `${v > A_BIG_NUMBER ? HRNumbers.toHumanString(v) : toCryptoString(roundNumber(v))}`;
};

/**
 *
 * @param v Crypto value
 * @returns A human readable string for this value
 */
export const toCryptoString = (v: number): string => {
  var s: string;
  if (v > 1) {
    // Applies commas to large numbers
    s = toFiatString(v).substring(1);
  } else {
    s = v
      .toFixed(7)// round to 7 places instead of 6
      .slice(0, -1) // then drop the last digit because rounding up breaks the upper limit

    // note, safari does not support regexp look behind
    // If there is a decimal, remove traliing 0's, leaving at least one left
     if (s.indexOf(".") !== -1) s = s.replace(/0+$/g, "0")
  }
  return s;
};

export { shrinkyInputClass };
