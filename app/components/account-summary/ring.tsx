import { useLayoutEffect, useState } from "react";

export default function Ring() {
  let [strokeOffset, setStrokeOffset] = useState<number>(400);

  useLayoutEffect(() => {
    setTimeout(() => setStrokeOffset(0), 1000);
  }, []);
  return (
    <div className="flex">
      <div
        style={{
          width: "208px",
          height: "208px",
        }}
      >
        <svg viewBox="0 0 128 128">
          <circle
            strokeDashoffset={strokeOffset}
            style={{
              strokeDasharray: "380",
              fill: "transparent",
              strokeWidth: 4,
              strokeLinecap: "round",
              transition: "stroke-dashoffset 0.5s ease",
            }}
            stroke="rgba(14, 221, 191, 1)"
            cx="64"
            cy="64"
            r="60"
          ></circle>
        </svg>
      </div>
    </div>
  );
}
