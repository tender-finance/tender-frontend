import { useContext, useState } from "react";
import { TenderContext } from "~/contexts/tender-context";
import MarketRow from "~/components/two-panes/market-row";
import { toShortFiatString, toShortCryptoString } from "~/lib/ui";
import BorrowFlow from "./borrow-flow";
import ReactModal from "react-modal";
import { Market } from "~/types/global";
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
    <div className="flex flex-col md:grid grid-cols-2 gap-6 mb-14">
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
        {marketsWithSupply.length >= 0 && (
          <div className="pane-custom border-custom mb-9">
            <div className="px-[15px] text-[22px] py-[20px] font-space font-bold text-[18px] border-b border-[#282C2B] md:px-[30px] md:py-[20px] md:text-xl">
              Supply
            </div>
            <table className="w-full h-full table-fixed">
              <thead>
                <tr className="w-full text-xs text-[#818987] font-nova font-semibolt border-b border-[#282C2B] ">
                  <th className="p-[15px] md:py-[20px] md:pl-[30px] md:pr-[20px] text-start text-[12px] md:text-[14px]">
                    Assets
                  </th>
                  <th className="p-[15px] md:py-[20px] md:px-[20px] text-start text-[12px] md:text-[14px]">
                    Total Supply
                  </th>
                  <th className="p-[15px] md:py-[20px] md:px-[20px] text-start text-[12px] md:text-[14px]">
                    Supply APY
                  </th>
                  <th className="text-start text-[12px] md:text-[14px] py-[20px] px-[15px] md:py-[20px] md:pr-[30px] md:pl-[20px]">
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
                      <td className="min-w-[150px] text-white font-nova font-normal p-[15px] md:py-[20px] md:pl-[30px] md:pr-[20px]">
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
                      <td className="text-white font-nova font-normal p-[15px] md:py-[20px] md:px-[20px]">
                        {m.marketData.depositApy}
                      </td>
                      <td className="text-white font-nova font-normal p-[15px] md:py-[20px] md:px-[20px]">
                        {m.marketData.depositApy}
                      </td>
                      <td className="text-white font-nova font-normal p-[15px] md:py-[20px] md:pr-[30px] md:pl-[20px]">
                        <div className="break-words mb-[5px]">
                          {toShortCryptoString(m.supplyBalance)}
                          {m.tokenPair.token.symbol}
                        </div>
                        <div className="break-words bg-dark-green text-dark-green rounded-md text-xs text-center py-1 px-2">
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
          <div className="mb-[20px] font-nova text-white text-[16px] md:mb-3 md:text-x">
            All Markets
          </div>
        )}
        {marketsWithoutSupply.length > 0 && (
          <div className="pane-custom border-custom">
            <table className="w-full h-full table-fixed">
              <thead>
                <tr className="w-full text-xs text-[#818987] font-nova font-semibolt border-b border-[#282C2B] ">
                  <th className="p-[15px] md:py-[20px] md:pl-[30px] md:pr-[20px] text-start text-[12px] md:text-[14px]">
                    Assets
                  </th>
                  <th className="p-[15px] md:py-[20px] md:px-[20px] text-start text-[12px] md:text-[14px]">
                    Total Supply
                  </th>
                  <th className="p-[15px] md:py-[20px] md:px-[20px] text-start text-[12px] md:text-[14px]">
                    Supply APY
                  </th>
                  <th className="text-start text-[12px] md:text-[14px] py-[20px] px-[15px] md:py-[20px] md:pr-[30px] md:pl-[20px]">
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
                      <td className="min-w-[150px] text-white font-nova font-normal p-[15px] md:py-[20px] md:pl-[30px] md:pr-[20px]">
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
                      <td className="text-white font-nova font-normal p-[15px] md:py-[20px] md:px-[20px]">
                        123.432 WETH
                      </td>
                      <td className="text-white font-nova font-normal p-[15px] md:py-[20px] md:px-[20px]">
                        {m.marketData.depositApy}
                      </td>
                      <td className="text-white font-nova font-normal p-[15px] md:py-[20px] md:pr-[30px] md:pl-[20px]">
                        <div className="break-words mb-[5px]">
                          {toShortCryptoString(m.walletBalance)}
                          {m.tokenPair.token.symbol}
                        </div>
                        <div className="break-words bg-dark-green text-dark-green rounded-md text-xs text-center py-1 px-2">
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
        )}
      </div>
      {/* Borrowing*/}
      <div>
        {marketsWithBorrow.length >= 0 && (
          <div className="pane-custom border-custom mb-9">
            <div className="px-[15px] text-[22px] py-[20px] font-space font-bold text-[18px] border-b border-[#282C2B] md:px-[30px] md:py-[20px] md:text-xl">
              Borrowing
            </div>
            <table className="w-full h-full table-fixed">
              <thead>
                <tr className="w-full text-xs text-[#818987] font-nova font-semibolt border-b border-[#282C2B] ">
                  <th className="p-[15px] md:py-[20px] md:pl-[30px] md:pr-[20px] text-start text-[12px] md:text-[14px]">
                    Assets
                  </th>
                  <th className="p-[15px] md:py-[20px] md:px-[20px] text-start text-[12px] md:text-[14px]">
                    Total Borrow
                  </th>
                  <th className="p-[15px] md:py-[20px] md:px-[20px] text-start text-[12px] md:text-[14px]">
                    Borrow APY
                  </th>
                  <th className="text-start text-[12px] md:text-[14px] py-[20px] px-[15px] md:py-[20px] md:pr-[30px] md:pl-[20px]">
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
                      <td className="min-w-[150px] text-white font-nova font-normal p-[15px] md:py-[20px] md:pl-[30px] md:pr-[20px] ">
                        <img
                          className="w-[24px] h-[24px] mr-[10px] md:mr-[16px] md:w-[40px] md:h-[40px]"
                          src={m.tokenPair.token.icon}
                          alt={m.tokenPair.token.symbol}
                        />
                        <span className="flex text-[14px] md:text-[16px]">
                          {m.tokenPair.token.symbol}
                        </span>
                      </td>
                      <td className="text-white font-nova font-normal p-[15px] md:py-[20px] md:px-[20px]">
                        {m.marketData.borrowApy}
                      </td>
                      <td className="text-white font-nova font-normal p-[15px] md:py-[20px] md:px-[20px]">
                        <div className="break-words mb-[5px]">
                          {toShortCryptoString(m.borrowBalance)}
                          {m.tokenPair.token.symbol}
                        </div>
                        <div className="break-words bg-dark-green text-dark-green rounded-md text-xs text-center py-1 px-2">
                          {m.borrowBalanceInUsd.toFixed(2)} {"USD"}
                        </div>
                      </td>
                      <td className="text-white font-nova font-normal p-[15px] md:py-[20px] md:pr-[30px] md:pl-[20px]">
                        {m.borrowLimitUsedOfToken}%
                      </td>
                    </MarketRow>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {marketsWithoutBorrow.length > 0 && (
          <div className="mb-[20px] font-nova text-white text-[16px] md:mb-3 md:text-x">
            All Markets
          </div>
        )}
        {marketsWithoutBorrow.length > 0 && (
          <div className="border-custom pane-custom">
            <table className="w-full h-full table-fixed ">
              <thead>
                <tr className="w-full text-xs text-[#818987] font-nova font-semibolt border-b border-[#282C2B] ">
                  <th className="p-[15px] md:py-[20px] md:pl-[30px] md:pr-[20px] text-start text-[12px] md:text-[14px]">
                    Assets
                  </th>
                  <th className="p-[15px] md:py-[20px] md:px-[20px] text-start text-[12px] md:text-[14px]">
                    Total Borrow
                  </th>
                  <th className="p-[15px] md:py-[20px] md:px-[20px] text-start text-[12px] md:text-[14px]">
                    Borrow APY
                  </th>
                  <th className="text-start text-[12px] md:text-[14px] py-[20px] px-[15px] md:py-[20px] md:pr-[30px] md:pl-[20px]">
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
                      <td className="min-w-[150px] text-white font-nova font-normal p-[15px] md:py-[20px] md:pl-[30px] md:pr-[20px] ">
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
                      <td className="text-white font-nova font-normal p-[15px] md:py-[20px] md:px-[20px]">
                        123.432 WETH
                      </td>
                      <td className="text-white font-nova font-normal p-[15px] md:py-[20px] md:px-[20px]">
                        {m.marketData.borrowApy}
                      </td>
                      <td className="text-white font-nova font-normal p-[15px] md:py-[20px] md:pr-[30px] md:pl-[20px]">
                        <div className="break-words mb-[5px]">
                          {toShortCryptoString(m.maxBorrowLiquidity)}
                          {m.tokenPair.token.symbol}
                        </div>
                        <div className="break-words bg-dark-green text-dark-green rounded-md text-xs text-center py-1 px-2">
                          {toShortFiatString(
                            m.maxBorrowLiquidity * m.tokenPair.token.priceInUsd
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
        )}
      </div>
    </div>
  );
}
