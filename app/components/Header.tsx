import { Link, useLocation } from "remix";
import ConnectWallet from "./connect-wallet";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";

export default function Header() {
  const location = useLocation();
  const chainId = Web3Hooks.useChainId();

  return (
    <div className="flex c mt-8">
      <div className="flex-grow">
        <a href="/">
          <img
            src="/images/logo1.svg"
            alt="Tender Finance"
            style={{
              height: 30,
            }}
          />
        </a>
      </div>
      <div>
        <div className="inline-block mr-3">
          <ConnectWallet />
        </div>
        <div className="inline-block">
          {location.pathname === "/" && chainId && (
            <button className="bg-brand-green text-white py-2 px-4">
              <Link to="/app">Enter App</Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
