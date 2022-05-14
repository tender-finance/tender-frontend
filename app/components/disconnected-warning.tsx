import { useOnSupportedNetwork } from "~/hooks/use-on-supported-network";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";

import { hooks as metaMaskHooks, metaMask } from "~/connectors/meta-mask";
import { Provider } from "@web3-react/types";
import { useEffect } from "react";
import { utils } from "ethers";

export default function Disconnected() {
  let provider = metaMaskHooks.useProvider();

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
  const chainId = Web3Hooks.useChainId();
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
      {!onSupportedChain && (
        <div className="bg-red-600 py-4 text-white text-center">
          Warning! Unsupported network. Want to{" "}
          <button
            className="underline"
            onClick={() => tryConnectingToMetis(provider)}
          >
            try Metis?
          </button>
        </div>
      )}
    </div>
  );
}
