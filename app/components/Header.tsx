import { Link, useLocation } from "remix";
import ConnectWallet from "./connect-wallet";
import clsx from "clsx";
export default function Header() {
  const location = useLocation();

  return (
    <div className="flex c mt-8">
      <div className="flex-grow">
        <img src="/images/logo.svg" alt="Tender Finance" />
      </div>
      <div>
        <button
          className={clsx("bg-brand-green text-white py-2 px-4", {
            hidden: location.pathname !== "/",
          })}
        >
          <Link to="/app">Enter App</Link>
        </button>
        <div
          className={clsx("", {
            hidden: location.pathname === "/",
          })}
        >
          <ConnectWallet />
        </div>
      </div>
    </div>
  );
}
