import { useState } from "react";
import ConnectWallet from "./connect-wallet";

export default function Header() {
  const [activePopupMenu, setActivePopupMenu] = useState(false);

  return (
    <div className="bg-black fixed z-10 inset-x-0 top-0 h-[110px] flex items-center justify-between items-center">
      <div className="flex w-full c items-center justify-between max-w-[1400px] relative">
        <div
          className="w-[120px] block md:w-[196px]"
          onClick={() => setActivePopupMenu(true)}
        >
          <a href="/">
            <img src="/images/logo1.svg" alt="Tender Finance" />
          </a>
        </div>
        <div className="text-[#ADB5B3] hidden lg:flex justify-center font-normal text-base font-nova absolute top-[50%] left-[50%] translate__50">
          <a
            className="pr-[15px] cursor-pointer hover:text-white"
            href="https://docs.tender.fi/introduction/what-is-tender.fi"
          >
            About
          </a>
          <a
            className="px-[15px] cursor-pointer hover:text-white"
            href="https://www.tender.fi/#roadmap"
          >
            Roadmap
          </a>
          <a
            className="px-[15px] cursor-pointer hover:text-white"
            href="https://www.tender.fi/#partners"
          >
            Partners
          </a>
          <a
            className="px-[15px] cursor-pointer hover:text-white"
            href="https://www.tender.fi/#team"
          >
            Team
          </a>
          <a
            className="px-[15px] cursor-pointer hover:text-white"
            href="https://docs.tender.fi"
          >
            Docs
          </a>
          <a
            className="pl-[15px] cursor-pointer hover:text-white"
            href="https://discord.com/invite/aKZ8hDBvYG"
          >
            Community
          </a>
        </div>
        <div className="flex items-center">
          <div className="lg:inline-block">
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
                href="https://www.tender.fi/#roadmap"
              >
                Roadmap
              </a>
              <a
                className="mb-2.5 cursor-pointer hover:text-white"
                href="https://www.tender.fi/#partners"
              >
                Partners
              </a>
              <a
                className="mb-2.5 cursor-pointer hover:text-white"
                href="https://www.tender.fi/#team"
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
