import { useEffect, useState } from "react";

const NEAR_ZERO_PERCENT = 385;
const NEAR_HUNDRED_PERCENT = 760;

export default function Ring({ percent }: { percent: number }) {
  let [strokeOffset, setStrokeOffset] = useState<number>(NEAR_ZERO_PERCENT);

  useEffect(() => {
    if (!percent) {
      return;
    }
    let offsetOffest =
      (NEAR_HUNDRED_PERCENT - NEAR_ZERO_PERCENT) * (percent / 100);
    setTimeout(() => setStrokeOffset(NEAR_ZERO_PERCENT + offsetOffest), 300);
  }, [percent]);

  return (
    <div className="flex">
      <div
        className="w-[109px] h-[108px] md:w-[164.96px] md:h-[164.23px]"
        style={{
          transform: "rotate(80deg) scale(1.05)",
        }}
      >
        <svg viewBox="0 0 128 128">
          <circle
            strokeDashoffset={strokeOffset}
            style={{
              strokeDasharray: "380",
              fill: "transparent",
              strokeWidth: 5,
              strokeLinecap: "round",
              transition: "stroke-dashoffset 0.2s ease",
            }}
            stroke={`${
              percent >= 0 ? "url('#myGradientLight')" : "rgba(9, 11, 21, 0.32)"
            }`}
            cx="64"
            cy="64"
            r="60"
          ></circle>
          <linearGradient id="myGradientLight" gradientTransform="rotate(90)">
            <stop offset="0%" stopColor="#14F195" />
            <stop offset="100%" stopColor="#14F1D6" />
          </linearGradient>
        </svg>
      </div>
    </div>
  );
}
