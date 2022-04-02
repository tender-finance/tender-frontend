import { hooks, metaMask } from "~/connectors/meta-mask";
const {
  useChainId,
  useAccounts,
  useError,
  useIsActivating,
  useIsActive,
  useProvider,
  useENSNames,
} = hooks;

// const switchChain = useCallback(
//   async (desiredChainId: number) => {
//     setDesiredChainId(desiredChainId)
//     // if we're already connected to the desired chain, return
//     if (desiredChainId === chainId) return
//     // if they want to connect to the default chain and we're already connected, return
//     if (desiredChainId === -1 && chainId !== undefined) return

//     if (connector instanceof WalletConnect || connector instanceof Network) {
//       await connector.activate(desiredChainId === -1 ? undefined : desiredChainId)
//     } else {
//       await connector.activate(desiredChainId === -1 ? undefined : getAddChainParameters(desiredChainId))
//     }
//   },
//   [connector, chainId]
// )
function connectWallet() {
  console.log("boop");
}
export default function ConnectWallet() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();

  const isActive = useIsActive();

  return (
    <div className="box">
      {isActive && accounts && (
        <div className="text-sm text-gray-400">Connected as</div>
      )}
      {!isActive && (
        <>
          <button
            className="bg-brand-green text-white py-2 px-4"
            onClick={isActivating ? undefined : () => metaMask.activate()}
            disabled={isActivating}
          >
            Connect wallet
          </button>
        </>
      )}
      {!isActive && error && <></>}
    </div>
  );
}
