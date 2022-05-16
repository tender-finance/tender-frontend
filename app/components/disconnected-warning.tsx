import { useOnSupportedNetwork } from "~/hooks/use-on-supported-network";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";
import { useEffect, useRef } from "react";

export default function Disconnected() {
  const chainId = Web3Hooks.useChainId();
  let onSupportedChain = useOnSupportedNetwork(chainId);

  let barRef = useRef(null);

  useEffect(() => {
    setInterval(() => {
      let barEl = barRef.current as HTMLDivElement | null;

      if (!barEl) {
        return;
      }

      barEl.style.opacity = "100";
    }, 500);
  });

  return (
    <div
      ref={barRef}
      style={{
        height: "30px",
        opacity: 0,
        transition: "opacity 0.4s ease-in",
      }}
    >
      {!onSupportedChain && (
        <div className="bg-red-600 py-4 text-white text-center ">
          Warning! Unsupported network.
        </div>
      )}
    </div>
  );
}
