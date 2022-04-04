import { useEffect } from "react";
import { hooks, metaMask } from "~/connectors/meta-mask";
const { useAccounts, useError, useIsActivating, useIsActive } = hooks;

export default function ConnectWallet() {
  const accounts = useAccounts();
  const error = useError();
  const isActivating = useIsActivating();

  const isActive = useIsActive();

  function truncateAccount(accounts: string[]): string {
    return accounts
      .map((account) => `${account.slice(0, 3)}...${account.slice(-4)}`)
      .join(",");
  }

  useEffect(() => {
    void metaMask.connectEagerly();
  }, []);

  return (
    <div className="box">
      {isActive && accounts && (
        <div className="text-sm text-gray-400">
          <div>Connected as {truncateAccount(accounts)}</div>
        </div>
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
      {!isActive && error && <>{error}</>}
    </div>
  );
}
