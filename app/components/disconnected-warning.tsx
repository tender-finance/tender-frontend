import { useOnSupportedNetwork } from "~/hooks/use-on-supported-network";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";

export default function Disconnected() {
  const chainId = Web3Hooks.useChainId();
  let onSupportedChain = useOnSupportedNetwork(chainId);
  return (
    <div>
      {!onSupportedChain && (
        <div className="bg-red-600 py-4 text-white text-center">
          Warning! Unsupported network.
        </div>
      )}
    </div>
  );
}
