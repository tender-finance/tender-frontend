import { useEffect, useState } from "react";
import { hooks, metaMask } from "~/connectors/meta-mask";
import WalletDropdown from "./walletDropdown";
const { useAccounts, useError, useIsActive } = hooks;

export default function ConnectWallet({ inMenu }: { inMenu?: boolean }) {
  const accounts = useAccounts();
  const error = useError();
  const isActive = useIsActive();
  const [onClient, setOnClient] = useState<boolean>(false);

  useEffect(() => {
    setOnClient(true);
    void metaMask.connectEagerly();
  }, []);

  return (
    <div className="box text-center">
      {onClient && (
        <>
          {isActive && accounts && (
            <WalletDropdown
              inMenu={inMenu}
              addresses={accounts}
              networkName={"Metis Network"}
              walletIco={"/images/wallet-icons/metamask.svg"}
              isNetworkOnline={true}
              handlerDisconnect={() => console.log("Disconnected")}
            />
          )}

          {/* Prompt to Install Metamask if window.ethereum is not available */}
          {!window.ethereum && (
            <a
              className="border font-space flex items-center justify-center font-bold uppercase rounded-md text-dark-green w-[120px] md:text-[15px] h-[30px] md:w-[163px] md:h-[50px] text-[10px]"
              target="_blank"
              rel="noreferrer"
              href="https://metamask.io/"
              style={{ border: "solid #14f195 1px" }}
            >
              Connect wallet
            </a>
          )}

          {/* Prompt to Connect Wallet if not active */}
          {window.ethereum && !isActive && (
            <button
              data-testid="connect-wallet"
              style={{ border: "solid #14f195 1px" }}
              className="border font-space flex items-center justify-center font-bold uppercase rounded-md text-dark-green w-[120px] md:text-[15px] h-[30px] md:w-[163px] md:h-[50px] text-[10px]"
              onClick={() => metaMask.activate()}
            >
              Connect Wallet
            </button>
          )}
        </>
      )}

      {error?.message && (
        <div className="text-xs text-gray-500">{error.message}</div>
      )}
    </div>
  );
}
