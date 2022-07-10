import { useState, useRef, useEffect } from "react";

const WalletDropdown = ({ ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  //   close dropdown on click outside
  useEffect(() => {
    const closeDropdown = (e: any) => {
      if (bodyRef.current && !bodyRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", closeDropdown);

    return () => {
      window.removeEventListener("click", closeDropdown);
    };
  }, []);

  return (
    <div className="relative" ref={bodyRef}>
      {/* menu button */}
      <div
        className={`${
          isOpen ?? "w-[113px] h-[37px]"
        } flex mr-[5px] pr-[9px] pb-[10px] pt-[11px] pl-[13px] md:mr-[0px] md:pl-[14px] md:pt-[1px] md:pr-[0px] md:pb-[0px] dropdown__button cursor-pointer rounded-[6px] flex items-center md:w-[157px] md:h-[38px]`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <img
          className={`${isOpen ? "hidden" : "block md:hidden"}`}
          src="images/ico/wallet.svg"
        />
        <div className="hidden md:block mr-[9px]">
          <img src={props.providerIco} />
        </div>

        <div
          className={`${
            isOpen ? "block mr-[31px]" : "hidden md:block"
          } text-sm  font-semibold text-right leading-[14px] font-nova`}
        >
          {props.walletId}
        </div>
        <div
          className={`${
            isOpen ? "ml-[10px] block" : "hidden md:block"
          } w-[8px] h-[8px] absolute top-[15px] right-[16px] md:absolute md:top-[14px] md:right-[11px] ${
            isOpen
              ? "dropdown__arrow dropdown__arrow-active"
              : "dropdown__arrow"
          }`}
        ></div>
      </div>

      {/* menu body */}
      <div
        className={`w-[220px] h-[245px] md:w-[219px] md:h-[250px] rounded-[6px] ${
          props.openTop
            ? "top-[-255px] left-[calc(50%-110px)]"
            : "right-[-8px] top-[calc(100%+5px)] md:right-[0px] md:top-[calc(100%+8px)]"
        } absolute ${
          isOpen ? "dropdown__body dropdown__body-active" : "dropdown__body"
        }`}
      >
        <div className="flex items-center py-[13px] px-[15px] md:py-[15px] md:px-[15px] border-b border-[#b5cfcc2b]">
          <div className="flex pt-[3px]">
            <img src={props.providerIcoLarge} />
          </div>
          <p className="pl-[10px] text-base font-nova font-semibold text-right leading-[19.49px]">
            {props.walletId}
          </p>
        </div>
        <div className="flex-col text-left pt-[13px] px-[15px] md:pt-[15px] md:px-[15px] border-b border-[#b5cfcc2b]">
          <p className="text-sm font-nova font-semibold text-[#818987] leading-[19.49px]">
            Network
          </p>
          <div className="pl-[1px] pt-[2px] pb-[13px]">
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
        <div className="flex-col uppper py-[15px]">
          <button
            onClick={() => {
              navigator.clipboard.writeText(props.walletId);
            }}
            className="py-[9px] mb-3 leading-[20.4px] text-xs text-center text-dark-green font-bold uppercase rounded-[6px] border border-[#14f195] w-full max-w-[189px] max-h-[38px] font-space"
          >
            {" "}
            copy address
          </button>
          <button className="py-[9px] leading-[20.4px] text-xs text-center text-dark-green font-bold uppercase rounded-[6px] border border-[#14f195] w-full max-w-[189px] max-h-[38px] font-space">
            disconnect wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletDropdown;
