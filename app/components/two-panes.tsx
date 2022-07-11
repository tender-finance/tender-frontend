import { useContext, useState } from "react";
import ReactModal from "react-modal";
import { TenderContext } from "~/contexts/tender-context";
import { Market } from "~/types/global";
import { toShortFiatString, toShortCryptoString } from "~/lib/ui";
import MarketRow from "~/components/two-panes/market-row";
import BorrowFlow from "./borrow-flow";
import DepositFlow from "./deposit-flow";

export default function TwoPanes() {
  let { markets } = useContext(TenderContext);
  let [openMarket, setOpenMarket] = useState<Market | null>(null);
  let [action, setAction] = useState<"depositing" | "borrowing">("depositing");

  const depositInto = (market: Market) => {
    setAction("depositing");
    setOpenMarket(market);
  };

  const borrowFrom = (market: Market) => {
    setAction("borrowing");
    setOpenMarket(market);
  };

  // markets with less than this amount are shown as not actively supplying or borrowing
  const DUST_LIMIT = 0.01;

  const marketsWithSupply = markets.filter(
    (m) => m.supplyBalance && m.supplyBalanceInUsd > DUST_LIMIT
  );

  const marketsWithBorrow = markets.filter(
    (m) => m.borrowBalance && m.borrowBalanceInUsd > 0.001
  );

  const marketsWithoutBorrow = markets.filter(
    (m) => !m.borrowBalance || m.borrowBalanceInUsd <= 0.001
  );

  const marketsWithoutSupply = markets.filter(
    (m) => !m.supplyBalance || m.supplyBalanceInUsd <= 0.001
  );

  return (
    <div className="flex flex-col md:grid grid-cols-2 gap-[20px] mb-14">
      <ReactModal
        shouldCloseOnOverlayClick={true}
        isOpen={openMarket !== null}
        onRequestClose={() => setOpenMarket(null)}
        portalClassName="modal"
        style={{
          content: {
            inset: "unset",
            margin: "50px auto",
            zoom: "75%",
            position: "relative",
            maxWidth: 600,
          },
        }}
        closeTimeoutMS={200}
      >
        {openMarket &&
          (action === "depositing" ? (
            <DepositFlow
              key={openMarket.id}
              closeModal={() => setOpenMarket(null)}
              market={openMarket}
            />
          ) : (
            <BorrowFlow
              key={openMarket.id}
              closeModal={() => setOpenMarket(null)}
              market={openMarket}
            />
          ))}
      </ReactModal>

      <div>
        {marketsWithSupply.length > 0 && (
          <div className="pb-[5px]  pane-custom border-custom mb-[20px] md:pb-[0px] md:mb-[40px]">
            <div className="px-[15px] textSize22 py-[17px] md:py-[20px] font-space font-bold text-[18px] border-b border-[#282C2B] md:px-[30px] md:pt-[18px] md:pb-[19px] md:text-xl">
              Supply
            </div>
            <table className="w-full h-full table-fixed">
              <thead>
                <tr
                  className={`w-full text-xs text-[#818987] font-nova font-semibolt ${
                    marketsWithSupply.length && "border-b border-[#282C2B]"
                  }`}
                >
                  <th className="pr-[80px] pt-[13px]  p-[15px] md:pr-[0px] md:pl-[30px] md:pr-[0px] text-start text-[12px] md:text-[14px]">
                    Asset
                  </th>
                  <th className="pr-[51px]  pt-[13px] whitespace-nowrap md:whitespace-normal p-[15px] md:pl-[30px] md:pr-[0px] text-start text-[12px] md:text-[14px]">
                    Total Supply
                  </th>
                  <th className="pr-[50px]  pt-[13px] whitespace-nowrap md:whitespace-normal p-[15px] md:pl-[30px] md:pr-[0px] text-start text-[12px] md:text-[14px]">
                    Supply APY
                  </th>
                  <th className="py-[20px] pt-[13px] px-[15px] md:py-[20px] text-start text-[12px] md:text-[14px] md:pl-[10px] md:pr-[10px]">
                    Deposits
                  </th>
                </tr>
              </thead>

              <tbody>
                {marketsWithSupply.map((m) => {
                  return (
                    <MarketRow
                      openMarket={() => depositInto(m)}
                      market={m}
                      key={m.id}
                    >
                      <td className="relative text-white font-nova font-normal pl-[14px] pb-[30px] md:pt-[24px] md:pb-[39px] md:pl-[30px] md:pr-[0px]">
                        <div className="flex items-center jusstify-left">
                          <img
                            className="w-[24px] h-[24px] mr-[10px] md:mr-[16px] md:w-[40px] md:h-[40px]"
                            src={m.tokenPair.token.icon}
                            alt={m.tokenPair.token.symbol}
                          />
                          <span className="flex text-[14px] md:text-[16px]">
                            {m.tokenPair.token.symbol}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap md:whitespace-normal relative text-white font-nova font-normal pl-[14px] pb-[30px] md:pt-[24px] md:pb-[39px] md:pl-[30px] md:pr-[0px]">
                        {toShortCryptoString(
                          Number(m.marketData.marketSizeUsd)
                        )}{" "}
                        {m.tokenPair.token.symbol}
                      </td>
                      <td className="relative text-white font-nova font-normal pl-[14px] pb-[30px] md:pt-[24px] md:pb-[39px] md:pl-[30px] md:pr-[0px]">
                        {m.marketData.depositApy}
                      </td>
                      <td className="relative text-white font-nova font-normal pb-[30px] md:pt-[24px] md:pb-[39px] md:pr-[30px] pr-[15px] md:pl-[10px]">
                        <div className="custom__hidden">
                          {toShortCryptoString(m.supplyBalance)}{" "}
                          {m.tokenPair.token.symbol}
                        </div>
                        <div className="custom__hidden break-words bg-dark-green text-dark-green rounded-md text-xs text-center py-1 px-2 absolute top-[40px] md:top-[57px] left-[10px]">
                          {m.supplyBalanceInUsd.toFixed(2)}
                          {" USD"}
                        </div>
                      </td>
                    </MarketRow>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {marketsWithoutSupply.length > 0 && (
          <div>
            <div className="mb-[20px] font-nova text-white text-[14px] font-semibold tracking-[0.1em] md:mb-[15px] md:text-x">
              All Markets
            </div>
            <div className="pb-[5px] md:pb-[0px] pane-custom border-custom">
              <table className="w-full h-full table-fixed">
                <thead>
                  <tr className="w-full text-xs text-[#818987] font-nova font-semibolt border-b border-[#282C2B] ">
                    <th className="pr-[80px] pt-[15px] p-[15px] md:pr-[0px] md:pl-[30px] md:pr-[0px] text-start text-[12px] md:text-[14px]">
                      Asset
                    </th>
                    <th className="whitespace-nowrap md:whitespace-normal pr-[51px] pt-[15px] p-[15px] md:pl-[30px] md:pr-[0px] text-start text-[12px] md:text-[14px]">
                      Total Supply
                    </th>
                    <th className="whitespace-nowrap md:whitespace-normal pr-[50px] pt-[15px] p-[15px] md:pl-[30px] md:pr-[0px] text-start text-[12px] md:text-[14px]">
                      Supply APY
                    </th>
                    <th className="py-[20px] pt-[13px] px-[15px] md:py-[20px] text-start text-[12px] md:text-[14px] md:pl-[10px] md:pr-[10px]">
                      Wallet
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {marketsWithoutSupply.map((m) => {
                    return (
                      <MarketRow
                        openMarket={() => depositInto(m)}
                        market={m}
                        key={m.id}
                      >
                        <td className="relative text-white font-nova font-normal pl-[14px] pb-[30px] md:pt-[24px] md:pb-[39px] md:pl-[30px] md:pr-[0px]">
                          <div className="flex items-center jusstify-left">
                            <img
                              className="w-[24px] h-[24px] mr-[10px] md:mr-[16px] md:w-[40px] md:h-[40px]"
                              src={m.tokenPair.token.icon}
                              alt={m.tokenPair.token.symbol}
                            />
                            <span className="flex text-[14px] md:text-[16px]">
                              {m.tokenPair.token.symbol}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap md:whitespace-normal relative text-white font-nova font-normal pl-[14px] pb-[30px] md:pt-[24px] md:pb-[39px] md:pl-[30px] md:pr-[0px]">
                          {toShortCryptoString(
                            Number(m.marketData.marketSizeUsd)
                          )}{" "}
                          {m.tokenPair.token.symbol}
                        </td>
                        <td className="relative text-white font-nova font-normal pl-[14px] pb-[30px] md:pt-[24px] md:pb-[39px] md:pl-[30px] md:pr-[0px]">
                          {m.marketData.depositApy}
                        </td>
                        <td className="relative text-white font-nova font-normal pb-[30px] md:pt-[24px] md:pb-[39px] md:pr-[30px] pr-[15px] md:pl-[10px]">
                          <div className="custom__hidden">
                            {toShortCryptoString(m.walletBalance)}{" "}
                            {m.tokenPair.token.symbol}
                          </div>
                          <div className="custom__hidden break-words bg-dark-green text-dark-green rounded-md text-xs text-center py-1 px-2 absolute top-[40px] md:top-[57px] left-[10px]">
                            {toShortFiatString(
                              m.walletBalance * m.tokenPair.token.priceInUsd
                            )}
                            USD
                          </div>
                        </td>
                      </MarketRow>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div>
        {marketsWithBorrow.length > 0 && (
          <div className="pb-[5px] md:pb-[0px] pane-custom border-custom mb-[20px] md:mb-[40px]">
            <div className="px-[15px] textSize22 py-[17px] md:py-[20px] font-space font-bold text-[18px] border-b border-[#282C2B] md:px-[30px] md:pt-[18px] md:pb-[19px] md:text-xl">
              Borrow
            </div>
            <table className="w-full h-full table-fixed">
              <thead>
                <tr
                  className={`w-full text-xs text-[#818987] font-nova font-semibolt ${
                    marketsWithBorrow.length && "border-b border-[#282C2B]"
                  }`}
                >
                  <th className="pr-[80px] pt-[13px]  p-[15px] md:pr-[0px] md:pl-[30px] md:pr-[0px] text-start text-[12px] md:text-[14px]">
                    Asset
                  </th>
                  <th className="pr-[51px]  pt-[13px] whitespace-nowrap md:whitespace-normal p-[15px] md:pl-[30px] md:pr-[0px] text-start text-[12px] md:text-[14px]">
                    Total Borrow
                  </th>
                  <th className="pr-[50px]  pt-[13px] whitespace-nowrap md:whitespace-normal p-[15px] md:pl-[30px] md:pr-[0px] text-start text-[12px] md:text-[14px]">
                    Borrow APY
                  </th>
                  <th className="py-[20px] pt-[13px] px-[15px] md:py-[20px] text-start text-[12px] md:text-[14px] md:pl-[10px] md:pr-[10px]">
                    Withdrawals
                  </th>
                </tr>
              </thead>

              <tbody>
                {marketsWithBorrow.map((m) => {
                  return (
                    <MarketRow
                      openMarket={() => borrowFrom(m)}
                      market={m}
                      key={m.id}
                    >
                      <td className="relative text-white font-nova font-normal pl-[14px] pb-[30px] md:pt-[24px] md:pb-[39px] md:pl-[30px] md:pr-[0px]">
                        <div className="flex items-center jusstify-left">
                          <img
                            className="w-[24px] h-[24px] mr-[10px] md:mr-[16px] md:w-[40px] md:h-[40px]"
                            src={m.tokenPair.token.icon}
                            alt={m.tokenPair.token.symbol}
                          />
                          <span className="flex text-[14px] md:text-[16px]">
                            {m.tokenPair.token.symbol}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap md:whitespace-normal relative text-white font-nova font-normal pl-[14px] pb-[30px] md:pt-[24px] md:pb-[39px] md:pl-[30px] md:pr-[0px]">
                        {toShortCryptoString(
                          Number(m.marketData.totalBorrowedUsd)
                        )}{" "}
                        {m.tokenPair.token.symbol}
                      </td>
                      <td className="relative text-white font-nova font-normal pl-[14px] pb-[30px] md:pt-[24px] md:pb-[39px] md:pl-[30px] md:pr-[0px]">
                        {m.borrowLimitUsedOfToken}%
                      </td>
                      <td className="relative text-white font-nova font-normal pb-[30px] md:pt-[24px] md:pb-[39px] md:pr-[30px] pr-[15px] md:pl-[10px]">
                        <div className="custom__hidden">
                          {toShortCryptoString(m.borrowBalance)}{" "}
                          {m.tokenPair.token.symbol}
                        </div>
                        <div className="custom__hidden break-words bg-dark-green text-dark-green rounded-md text-xs text-center py-1 px-2 absolute top-[40px] md:top-[57px] left-[10px]">
                          {m.borrowBalanceInUsd.toFixed(2)} {"USD"}
                        </div>
                      </td>
                    </MarketRow>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {marketsWithoutBorrow.length > 0 && (
          <div>
            <div className="mb-[20px] font-nova text-white text-[14px] font-semibold tracking-[0.1em] md:mb-[15px] md:text-x">
              All Markets
            </div>
            <div className="pb-[5px] md:pb-[0px] pane-custom border-custom">
              <table className="w-full h-full table-fixed !pb-[23px] md:pb-[0px]  md:pt-[0px]">
                <thead>
                  <tr className="w-full text-xs text-[#818987] font-nova font-semibolt border-b border-[#282C2B] ">
                    <th className="pl-[15px] pt-[15px] pr-[80px] pb-[15px] md:pr-[0px] md:pl-[30px] md:pr-[0px] text-start text-[12px] md:text-[14px]">
                      Asset
                    </th>
                    <th className="whitespace-nowrap md:whitespace-normal p-[15px] pr-[51px] md:pl-[30px] md:pr-[0px] text-start text-[12px] md:text-[14px]">
                      Total Borrow
                    </th>
                    <th className="whitespace-nowrap md:whitespace-normal p-[15px] pr-[51px] md:pl-[30px] md:pr-[0px] text-start text-[12px] md:text-[14px]">
                      Borrow APY
                    </th>
                    <th className="py-[20px] pt-[13px] px-[15px] md:py-[20px] text-start text-[12px] md:text-[14px] md:pl-[10px] md:pr-[10px]">
                      Available Borrow
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {marketsWithoutBorrow.map((m) => {
                    return (
                      <MarketRow
                        openMarket={() => borrowFrom(m)}
                        market={m}
                        key={m.id}
                      >
                        <td className="relative text-white font-nova font-normal pl-[14px] pb-[30px] md:pt-[24px] md:pb-[39px] md:pl-[30px] md:pr-[0px]">
                          <div className="flex items-center jusstify-left">
                            <img
                              className="w-[24px] h-[24px] mr-[10px] md:mr-[16px] md:w-[40px] md:h-[40px]"
                              src={m.tokenPair.token.icon}
                              alt={m.tokenPair.token.symbol}
                            />
                            <span className="flex text-[14px] md:text-[16px]">
                              {m.tokenPair.token.symbol}
                            </span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap md:whitespace-normal relative text-white font-nova text-sm font-normal pl-[14px] pb-[30px] md:pt-[24px] md:pb-[39px] md:pl-[30px] md:pr-[0px]">
                          {m.marketData.totalBorrowedUsd}{" "}
                          {m.tokenPair.token.symbol}
                        </td>
                        <td className="relative pl-[15px] pb-[30px] text-white font-nova font-normal md:pt-[24px] md:pb-[39px] md:pl-[30px] md:pr-[0px]">
                          {m.marketData.borrowApy}
                        </td>
                        <td className="relative text-white font-nova font-normal pb-[30px] md:pt-[24px] md:pb-[39px] md:pr-[30px] pr-[15px] md:pl-[10px]">
                          <div className="custom__hidden">
                            {toShortCryptoString(m.maxBorrowLiquidity)}{" "}
                            {m.tokenPair.token.symbol}
                          </div>
                          <div className="custom__hidden break-words bg-dark-green text-dark-green rounded-md text-xs text-center py-1 px-2 absolute top-[40px] md:top-[57px] left-[10px]">
                            {toShortFiatString(
                              m.maxBorrowLiquidity *
                                m.tokenPair.token.priceInUsd
                            )}
                            USD
                          </div>
                        </td>
                      </MarketRow>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
