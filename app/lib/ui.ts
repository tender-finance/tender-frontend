const DEFAULT_TEXT_CLASS = "text-6xl";

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
    className = "text-5xl";
  }
  return className;
};

/**
 *
 * @param v Number to round
 * @param withPrefix Indicates weather to include currency prefix (i.e. $)
 * @returns A number that's rounded and localized
 */
export const toMoneyString = (
  v: number,
  withPrefix: boolean = true
): string => {
  let roundedNumber = parseFloat(v.toFixed(2));
  let s = `${roundedNumber.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  })}`;
  return withPrefix ? s : s.substring(1);
};

export { shrinkyInputClass };
