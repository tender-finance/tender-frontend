import { useState } from "react";
import ConnectWallet from "./connect-wallet";

export default function Header() {
  const [activePopupMenu, setActivePopupMenu] = useState(false);

  return (
    <div className="fixed bg-black z-10 inset-x-0 top-0 h-16 flex items-center justify-between">
      <div className="flex w-full c items-center justify-between">
        <div
          className="w-[120px] mr-4 block md:w-[160px]"
          onClick={() => setActivePopupMenu(true)}
        >
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
        <div className="text-[#ADB5B3] hidden lg:flex justify-center font-normal text-base font-nova">
          <a
            className="px-4 cursor-pointer hover:text-white"
            href="https://docs.tender.fi/introduction/what-is-tender.fi"
          >
            About
          </a>
          <a
            className="px-4 cursor-pointer hover:text-white"
            href="https://www.tender.fi/#Road"
          >
            Roadmap
          </a>
          <a
            className="px-4 cursor-pointer hover:text-white"
            href="https://www.tender.fi/#Partners"
          >
            Partners
          </a>
          <a
            className="px-4 cursor-pointer hover:text-white"
            href="https://www.tender.fi/#Team"
          >
            Team
          </a>
          <a
            className="px-4 cursor-pointer hover:text-white"
            href="https://docs.tender.fi"
          >
            Docs
          </a>
          <a
            className="px-4 cursor-pointer hover:text-white"
            href="https://discord.com/invite/aKZ8hDBvYG"
          >
            Community
          </a>
        </div>
        <div className="flex items-center">
          <div className="lg:inline-block mr-3">
            <ConnectWallet />
          </div>

          <div
            className={`flex lg:hidden header__burg ${
              activePopupMenu ? "active" : ""
            }`}
            onClick={() => setActivePopupMenu(!activePopupMenu)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className={`aside__menu__wrap ${activePopupMenu ? "act" : ""}`}>
          <div
            className="aside__menu__bac"
            onClick={() => setActivePopupMenu(false)}
          ></div>
          <div className="aside__menu__container">
            <div className="flex justify-center flex-col text-[#ADB5B3] font-nova-400 text-xl">
              <a
                className="mb-2.5 cursor-pointer hover:text-white"
                href="https://docs.tender.fi/introduction/what-is-tender.fi"
              >
                About
              </a>
              <a
                className="mb-2.5 cursor-pointer hover:text-white"
                href="https://www.tender.fi/#Road"
              >
                Roadmap
              </a>
              <a
                className="mb-2.5 cursor-pointer hover:text-white"
                href="https://www.tender.fi/#Partners"
              >
                Partners
              </a>
              <a
                className="mb-2.5 cursor-pointer hover:text-white"
                href="https://www.tender.fi/#Team"
              >
                Team
              </a>
              <a
                className="mb-2.5 cursor-pointer hover:text-white"
                href="https://docs.tender.fi"
              >
                Docs
              </a>
              <a
                className="mb-2.5 cursor-pointer hover:text-white"
                href="https://discord.com/invite/aKZ8hDBvYG"
              >
                Community
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
