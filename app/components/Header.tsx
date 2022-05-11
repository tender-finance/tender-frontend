import ConnectWallet from "./connect-wallet";

export default function Header() {
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
      </div>
    </div>
  );
}
