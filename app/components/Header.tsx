import ConnectWallet from "./connect-wallet";

export default function Header() {
  return (
    <div className="flex c mt-8 justify-between md:flex-row flex-col">
      <div className="shrink-0">
        <a href="/">
          <img
            src="/images/logo1.svg"
            alt="Tender Finance"
            style={{
              height: 30,
              margin: 20,
            }}
          />
        </a>
      </div>
      <div className="inline-block mr-3 shrink-0">
        <ConnectWallet />
      </div>
    </div>
  );
}
