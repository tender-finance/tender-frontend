import { useOnSupportedNetwork } from "~/hooks/use-on-supported-network";
import { hooks } from "~/connectors/meta-mask";
import type { ProviderRpcError } from "@web3-react/types";
import { useEffect } from "react";

const { useIsActive } = hooks;

export default function Disconnected() {
  let provider = hooks.useProvider();
  const isActive = useIsActive();

  useEffect(() => {
    // provider?.provider.request({
    //   method: "wallet_addEthereumChain",
    //   params: [
    //     {
    //       chainId: "0x89",
    //       rpcUrls: ["https://rpc-mainnet.matic.network/"],
    //       chainName: "Matic Mainnet",
    //       nativeCurrency: {
    //         name: "MATIC",
    //         symbol: "MATIC",
    //         decimals: 18,
    //       },
    //       blockExplorerUrls: ["https://polygonscan.com/"],
    //     },
    //   ],
    // });
  }, [provider]);

  const chainId = hooks.useChainId();
  let onSupportedChain = useOnSupportedNetwork(chainId);

  let tryConnectingToMetis = async (p: typeof provider) => {
    if (!p) {
      return;
    }
    let targetNetworkId = 1088;
    let targetNetworkIdHex = `0x${targetNetworkId.toString(16)}`;

    p?.provider
      .request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetNetworkIdHex }],
      })
      .catch((error: ProviderRpcError) => {
        if (error.code === 4902) {
          // if we're here, we can try to add a new network
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return p?.provider!.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainName: "Metis Network",
                nativeCurrency: {
                  name: "Metis",
                  symbol: "METIS", // 2-6 characters long
                  decimals: 18,
                },
                rpcUrls: ["https://andromeda.metis.io/?owner=1088"],
                blockExplorerUrls: ["https://andromeda-explorer.metis.io/"],
                chainId: targetNetworkIdHex,
              },
            ],
          });
        } else {
          throw error;
        }
      });
  };
  return (
    <div>
      {isActive && !onSupportedChain && (
        <div
          style={{
            background: "linear-gradient(270deg, #1BD6CF 0%, #00E5AF 100%)",
          }}
          className="text-center bg-brand-green text-gray-900 py-4 px-4 rounded-md text-sm"
        >
          Warning! Unsupported network.{" "}
          <button
            className="underline"
            onClick={() => tryConnectingToMetis(provider)}
          >
            Switch to Metis
          </button>
        </div>
      )}
      {!isActive && (
        <div
          style={{
            background: "linear-gradient(270deg, #1BD6CF 0%, #00E5AF 100%)",
          }}
          className="text-center bg-brand-green text-gray-900 py-4 px-4 rounded-md text-sm"
        >
          Warning: Unsupported network. Connect Wallet and we can help you
          switch.
        </div>
      )}
    </div>
  );
}
