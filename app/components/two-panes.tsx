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
    <div className="flex flex-col md:grid grid-cols-2 gap-9 mb-14">
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
        {/* Empty state heading for borrow */}

        {marketsWithSupply.length == 0 && (
          <div className="py-6 text-2xl font-space font-bold mb-4">Supply</div>
        )}
        {marketsWithSupply.length >= 0 && (
          <div className="pane-custom border-custom mb-9 md:pane-custom border-custom mb-9">
            <div className="px-8 py-6 font-space font-bold text-2xl border-b border-[#282C2B] mb-4 w-full">
              Supply
            </div>
            <table className="w-full h-full table-fixed">
              <thead>
                <tr className="text-xs text-[#818987] font-nova font-semibolt border-b border-[#282C2B] w-full">
                  <th className="px-4 pb-4 md:px-8 text-left">Asset</th>
                  <th className="flex pb-4 px-4 text-left md:px-8">
                    APY / Earned
                  </th>
                  <th className="text-right pb-4 px-4 md:px-8 pb-4 text-left">
                    Balance
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
                      <td className="min-w-[130px] items-left px-4 py-6 text-left text-white bg-red font-nova font-normal h-full w-full md:px-8">
                        <div className="flex items-center jusstify-left">
                          <img
                            className="w-[32px] h-[32px] mr-2"
                            src={m.tokenPair.token.icon}
                            alt={m.tokenPair.token.symbol}
                          />
                          <span className="flex">
                            {m.tokenPair.token.symbol}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 text-left py-6 text-white font-nova font-normal">
                        {m.marketData.depositApy}
                      </td>
                      <td className="text-right px-4 py-6 sm:text-left whitespace-nowrap text-white font-nova font-normal md:px-8">
                        <div>
                          {toShortCryptoString(m.supplyBalance)}
                          {m.tokenPair.token.symbol}
                        </div>
                        <div className="bg-dark-green rounded-md text-xs text-dark-green text-center py-1 px-2 inline-block whitespace-nowrap">
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
          <div className="mb-3 text-nova text-xl ">All Markets</div>
        )}
        {marketsWithoutSupply.length > 0 && (
          <div className="pane-custom border-custom py-6">
            <table className="w-full h-full table-fixed overflow-y-scroll">
              <thead>
                <tr className="w-full text-xs text-[#818987] font-nova font-semibolt border-b border-[#282C2B] ">
                  <th className="px-4 pb-4 md:px-8 text-left">Asset</th>
                  <th className="px-4 flex pb-4 md:px-8 text-left">
                    APY / Earned
                  </th>
                  <th className="px-4 pb-4 text-right sm:text-left pb-4 md:px-8">
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
                      <td className="min-w-[130px] items-left px-4 py-6 text-left text-white bg-red font-nova font-normal h-full w-full md:px-8">
                        <div className="flex items-center jusstify-left">
                          <img
                            className="w-[32px] h-[32px] mr-2"
                            src={m.tokenPair.token.icon}
                            alt={m.tokenPair.token.symbol}
                          />
                          <span className="flex">
                            {m.tokenPair.token.symbol}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 md:px-8 table-cell py-6 text-left text-white font-nova font-normal">
                        {m.marketData.depositApy}
                      </td>
                      <td className="text-right px-4 py-6 sm:text-left whitespace-nowrap text-white font-nova font-normal md:px-8">
                        <div>
                          {toShortCryptoString(m.walletBalance)}
                          {m.tokenPair.token.symbol}
                        </div>
                        <div className="bg-dark-green text-dark-green rounded-md text-xs text-center py-1 px-2 inline-block whitespace-nowrap">
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
        {/* Empty state heading for borrow */}
        {marketsWithBorrow.length == 0 && (
          <div className="py-6 font-space font-bold text-2xl  mb-4">
            Borrowing
          </div>
        )}
        {marketsWithBorrow.length >= 0 && (
          <div className="pane-custom border-custom mb-9 md:pane-custom border-custom mb-9 ">
            <div className="px-8 py-6 font-space font-bold text-2xl border-b border-[#282C2B] mb-4">
              Borrowing
            </div>
            <table className="w-full h-full table-fixed">
              <thead>
                <tr className="text-xs text-[#818987] font-nova font-semibolt">
                  <th className="px-4 pb-4 md:px-8 text-left">Assets</th>
                  <th className="flex pb-4 px-4 text-left whitespace-nowrap md:px-8">
                    APY / Accrued
                  </th>
                  <th className="px-4 pb-4 md:px-8 text-left">Balance</th>
                  <th className="px-4 pb-4 text-left whitespace-nowrap md:px-8">
                    % of Limit
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
                      <td className="min-w-[130px] flex px-4 py-6 text-left items-center h-full text-white font-nova font-normal md:px-8">
                        <img
                          className="w-[32px] h-[32px] mr-2"
                          src={m.tokenPair.token.icon}
                          alt={m.tokenPair.token.symbol}
                        />
                        <span className="flex">{m.tokenPair.token.symbol}</span>
                      </td>
                      <td className="px-4 text-left py-6 text-white font-nova font-normal">
                        {m.marketData.borrowApy}
                      </td>
                      <td className="text-right px-4 py-6 sm:text-left whitespace-nowrap text-white font-nova font-normal md:px-8">
                        <div>
                          {toShortCryptoString(m.borrowBalance)}
                          {m.tokenPair.token.symbol}
                        </div>

                        <div className="bg-dark-green text-dark-green rounded-md text-xs text-center py-1 px-2 inline-block whitespace-nowrap">
                          {m.borrowBalanceInUsd.toFixed(2)} {"USD"}
                        </div>
                      </td>

                      <td className="px-4 py-6 text-left text-brand-green font-bold md:px-8">
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
          <div className="mb-3 text-white text-xl">All Markets</div>
        )}
        {marketsWithoutBorrow.length > 0 && (
          <div className="border-custom pane-custom py-6">
            <table className="w-full h-full table-fixed ">
              <thead>
                <tr className="w-full text-xs text-[#818987] font-nova font-semibolt">
                  <th className="px-4 pb-4 md:px-8 text-left">Asset</th>
                  <th className="flex pb-4 px-4 text-left whitespace-nowrap md:px-8">
                    APY / Accrued
                  </th>

                  <th className="px-4 pb-4 text-right sm:text-left pb-4 md:px-8">
                    Liquidity
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
                      <td className="min-w-[130px] px-4 flex-col items-left flex py-6 text-left text-white font-nova font-normal h-full md:px-8">
                        <div className="flex items-center jusstify-left">
                          <img
                            className="w-[32px] h-[32px] mr-2"
                            src={m.tokenPair.token.icon}
                            alt={m.tokenPair.token.symbol}
                          />
                          <span className="flex">
                            {m.tokenPair.token.symbol}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 md:px-8 table-cell py-6 text-left text-white font-nova font-normal">
                        {m.marketData.borrowApy}
                      </td>
                      <td className="text-right px-4 py-6 md:px-8 text-left whitespace-nowrap text-white font-nova font-normal">
                        <div>
                          {toShortCryptoString(m.maxBorrowLiquidity)}
                          {m.tokenPair.token.symbol}
                        </div>
                        <div className="bg-dark-green text-dark-green text-xs rounded-md text-center py-1 px-2 inline-block whitespace-nowrap">
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
