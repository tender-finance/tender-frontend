import ConnectWallet from "./connect-wallet";

export default function Header() {
  return (
    <div className="flex c mt-8 justify-between">
      <div>
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
      <div className="flex justify-center text-gray-400 font-nova-400">
        <a className="px-2 cursor-pointer hover:text-white">About</a>
        <a className="px-2 cursor-pointer hover:text-white">Roadmap</a>
        <a className="px-2 cursor-pointer hover:text-white">Partners</a>
        <a className="px-2 cursor-pointer hover:text-white">Team</a>
        <a className="px-2 cursor-pointer hover:text-white">Docs</a>
        <a className="px-2 cursor-pointer hover:text-white">Community</a>
      </div>
      <div>
        <div className="inline-block mr-3">
          <ConnectWallet />
        </div>
      </div>
    </div>
  );
}
