import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import { useEagerConnect, useInactiveListener } from "../hooks";
import { connectorList } from "../connectors";

type ConnectorName = "MetaMask";

export default function ConnectWallet() {
  const [isConnecing, setIsConnecing] = useState(false);
  const { activate, deactivate, active, error, account } =
    useWeb3React<Web3Provider>();

  const triedEager = useEagerConnect();
  useInactiveListener(!triedEager);

  const handleClick = (connectorName: ConnectorName) => () => {
    setIsConnecing(true);
    activate(connectorList[connectorName]);
  };

  const handleDisconnect = () => {
    deactivate();
  };

  const handleRetry = () => {
    setIsConnecing(false);
    deactivate();
  };

  useEffect(() => {
    if (active) {
      setIsConnecing(false);
    }
  }, [active]);

  return (
    <div className="box">
      {active && (
        <div className="text-sm text-white">Connected as {account}</div>
      )}
      {!active && (
        <>
          <button
            className="bg-brand-green text-white py-2 px-4"
            onClick={handleClick("MetaMask")}
            disabled={isConnecing}
          >
            Connect wallet
          </button>
        </>
      )}
      {!active && error && <button onClick={handleRetry}>Retry</button>}
    </div>
  );
}
