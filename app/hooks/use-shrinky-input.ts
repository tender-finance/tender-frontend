import { useState, useEffect } from "react";

const DEFAULT_TEXT_CLASS = "text-6xl";
export function useShrinkyInput(len: number): string {
  let [textClass, setTextClass] = useState<string>(DEFAULT_TEXT_CLASS);

  useEffect(() => {
    if (len > 22) {
      setTextClass("text-md");
    } else if (len > 19) {
      setTextClass("text-lg");
    } else if (len > 17) {
      setTextClass("text-xl");
    } else if (len > 15) {
      setTextClass("text-2xl");
    } else if (len > 12) {
      setTextClass("text-3xl");
    } else if (len > 9) {
      setTextClass("text-4xl");
    } else if (len > 7) {
      setTextClass("text-5xl");
    } else {
      setTextClass(DEFAULT_TEXT_CLASS);
    }
  }, [len]);

  return textClass;
}
