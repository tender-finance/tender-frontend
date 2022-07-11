import { useState, useRef, useEffect } from "react";

interface Props {
  inMenu?: boolean;
  addresses: string[];
  networkName: string;
  isNetworkOnline: boolean;
  walletIco: string;
  handlerDisconnect: () => void;
}

const WalletDropdown = (props: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const dropdownRef = useRef<any>(null);

  function truncateAccount(account: string): string {
    return `${account.slice(0, 3)}...${account.slice(-4)}`;
  }

  useEffect(() => {
    const closeDropdown = (e: any) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", closeDropdown);
  }, []);

  return (
    <div
      className="relative z-40 max-w-[220px] max-h-[245px] m-auto"
      ref={dropdownRef}
    >
      <div
        className={`${
          props.inMenu ? "dropdown__button-inMenu" : ""
        } relative flex pr-[9px] pb-[10px] pt-[11px] pl-[14px] md:mr-[0px] md:pl-[14px] md:pt-[1px] md:pr-[0px] md:pb-[0px] bg-[#181D1B] cursor-pointer rounded-[6px] flex items-center md:w-[157px] md:h-[38px]`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          className={`${isOpen || props.inMenu ? "hidden" : "block md:hidden"}`}
          src="images/ico/wallet.svg"
          alt="..."
        />
        <div
          className={`${
            props.inMenu ? "block mr-[16px]" : "hidden md:block"
          } mr-[9px]`}
        >
          <img className="w-[16px]" src={props.walletIco} alt="..." />
        </div>
        <div
          className={`${
            isOpen || props.inMenu ? "block mr-[31px]" : "hidden md:block"
          } ${
            props.inMenu ? "mr-[10px!important]" : ""
          } text-sm font-semibold text-right leading-[14px] font-nova`}
        >
          {truncateAccount(props.addresses[0])}
        </div>
        <img
          className={`${
            !props.inMenu
              ? "absolute right-[9px] top-[50%] translate-y-[-50%]"
              : ""
          }  ${isOpen ? "rotate-180" : ""}`}
          src="images/ico/arrow-down.svg"
          alt="..."
        />
      </div>

      <div
        className={`w-[220px] h-[245px] md:w-[219px] md:h-[250px] rounded-[6px] ${
          props.inMenu
            ? "bottom-[60px]"
            : "right-[0px] top-[calc(100%+5px)] md:right-[0px] md:top-[calc(100%+8px)]"
        } absolute ${
          isOpen ? "dropdown__body dropdown__body-active" : "dropdown__body"
        }`}
      >
        <div className="flex items-center py-[13px] px-[15px] md:py-[15px] md:px-[15px] border-b border-[#b5cfcc2b]">
          <div className="flex pt-[3px]">
            <img className="w-[25px]" src={props.walletIco} alt="..." />
          </div>
          <p className="pl-[10px] text-base font-nova font-semibold text-right leading-[19.49px]">
            {truncateAccount(props.addresses[0])}
          </p>
        </div>
        <div className="flex-col text-left pt-[13px] px-[15px] md:pt-[15px] md:px-[15px] border-b border-[#b5cfcc2b]">
          <p className="text-sm font-nova font-semibold text-[#818987] leading-[19.49px]">
            Network
          </p>
          <div className="pt-[2px] pb-[13px] flex items-center">
            <span
              className={`inline-block rounded-full w-[8px] h-[8px] ${
                props.isNetworkOnline ? "bg-[#14F195]" : "bg-red-600"
              }`}
            ></span>
            <span className="px-[12px] text-sm font-nova font-norma leading-[19.49px]">
              {props.networkName}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center py-[15px]">
          <button
            onClick={() => {
              navigator.clipboard.writeText(props.addresses[0]);
            }}
            className="flex items-center justify-center mb-3 leading-[20.4px] text-xs text-center text-dark-green font-bold rounded-[6px] border border-[#14f195] w-[189px] h-[38px] font-space"
          >
            COPY ADDRESS
          </button>
          <button
            onClick={props.handlerDisconnect}
            className="flex items-center justify-center leading-[20.4px] text-xs text-center text-dark-green font-bold rounded-[6px] border border-[#14f195] w-[189px] h-[38px] font-space"
          >
            DISCONNECT WALLET
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletDropdown;
