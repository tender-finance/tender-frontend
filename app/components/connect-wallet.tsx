import { useEffect, useState } from "react";
import { hooks, metaMask } from "~/connectors/meta-mask";
const { useAccounts, useError, useIsActive } = hooks;

export default function ConnectWallet() {
  const accounts = useAccounts();
  const error = useError();
  const isActive = useIsActive();
  const [onClient, setOnClient] = useState(false);

  function truncateAccount(accounts: string[]): string {
    return accounts
      .map((account) => `${account.slice(0, 3)}...${account.slice(-4)}`)
      .join(",");
  }

  useEffect(() => {
    setOnClient(true);
    void metaMask.connectEagerly();
  }, []);

  return (
    <div className="box text-center">
      {/* only on the client */}
      {onClient && (
        <>
          {isActive && accounts && (
            <span className=" font-space flex items-center justify-center font-bold text-[10px] w-[100px] md:text-[15px] md:w-[auto]">
              Connected as {truncateAccount(accounts)}
            </span>
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
