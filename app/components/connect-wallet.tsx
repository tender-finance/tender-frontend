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
    setOnClient(true)
    void metaMask.connectEagerly();
  }, []);

  return (
    <div className="box">
      {/* only on the client */}
      {onClient && <>

        {isActive && accounts && (
          <span className="flex text-sm text-gray-400">
            <span className=" py-2 px-4">
              Connected as {truncateAccount(accounts)}
            </span>
          </span>
        )}

        {/* Prompt to Install Metamask if window.ethereum is not available */}
        {!window.ethereum && (
          <a
            className="border border-brand-green text-brand-green py-4 px-4 rounded-md text-sm"
            target="_blank" rel="noreferrer"
            href="https://metamask.io/"
          >
            Install MetaMask to get started
          </a>
        )}

        {/* Prompt to Connect Wallet if not active */}
        {window.ethereum && !isActive && (
          <button
            data-testid="connect-wallet"
            style={{
              background: "linear-gradient(270deg, #1BD6CF 0%, #00E5AF 100%)",
            }}
            className="hover:cursor-pointer bg-brand-green text-gray-900 py-4 px-4 rounded-md text-sm"
            onClick={() => metaMask.activate()}
          >
            Connect Wallet
          </button>
        )}
      </>}

      {error?.message && (
        <div className="text-xs text-gray-500">{error.message}</div>
      )}
    </div>
  );
}
