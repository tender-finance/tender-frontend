import { useContext } from "react";
import { TenderContext } from "~/contexts/tender-context";
import MarketSupplyRow from "~/components/two-panes/market-supply-row";
import MarketBorrowRow from "~/components/two-panes/market-borrow-row";
import { toShortFiatString, toShortCryptoString } from "~/lib/ui";

export default function TwoPanes() {
  let { markets } = useContext(TenderContext);

  const marketsWithSupply = markets.filter(
    (m) => m.supplyBalance && m.supplyBalanceInUsd > 0.001
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
    <div className="flex flex-col gap-9 mb-14 grid-cols-1 md:grid  grid-cols-2">
      {/* Supply */}

      <div>
        {/* Empty state heading for borrow */}

        {marketsWithSupply.length == 0 && (
          <div className="py-6 text-2xl font-space font-bold mb-4">Supply</div>
        )}
        {marketsWithSupply.length >= 0 && (
          <div className="pane-custom border-custom mb-9 md:pane-custom border-custom mb-9 ">
            <div className="px-8 py-6 font-space font-bold text-2xl border-b border-[#282C2B] mb-4">
              Supply
            </div>
            <table className="w-full h-full table-fixed">
              <thead>
                <tr className="text-xs text-[#818987] font-nova font-semibolt border-b border-[#282C2B]">
                  <th className="pb-4 px-8 text-left">Asset</th>
                  <th className="pb-4 px-8 text-left">APY / Earned</th>
                  <th className="pb-4 px-8 text-left">Balance</th>
                </tr>
              </thead>

              <tbody>
                {marketsWithSupply.map((m) => {
                  return (
                    <MarketSupplyRow market={m} key={m.id}>
                      <td className="flex px-8 py-6 text-left text-white font-nova font-normal items-center h-full">
                        <img
                          className="w-9 mr-2"
                          src={m.tokenPair.token.icon}
                          alt={m.tokenPair.token.symbol}
                        />
                        {m.tokenPair.token.symbol}
                      </td>
                      <td className="px-8 py-6 text-left">
                        {m.marketData.depositApy}
                      </td>
                      <td className="px-8 py-6 text-left whitespace-nowrap">
                        <div>
                          {toShortCryptoString(m.supplyBalance)}{" "}
                          {m.tokenPair.token.symbol}
                        </div>
                        <div className="bg-dark-green rounded-md text-xs text-dark-green text-center py-1 px-2 inline-block whitespace-nowrap">
                          {m.supplyBalanceInUsd.toFixed(2)}
                          {" USD"}
                        </div>
                      </td>
                    </MarketSupplyRow>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {marketsWithoutSupply.length > 0 && (
          <div className="mb-3 text-nova text-xl">All Markets</div>
        )}
        {marketsWithoutSupply.length > 0 && (
          <div className="pane-custom border-custom py-6 ">
            <table className="w-full h-full table-fixed">
              <thead>
                <tr className="text-xs text-[#818987] font-nova font-semibolt border-b border-[#282C2B]">
                  <th className="pb-4 px-8 text-left">Asset</th>
                  <th className="pb-4 px-8 text-left">APY / Earned</th>
                  <th className="pb-4 px-8 text-left">Wallet</th>
                </tr>
              </thead>

              <tbody>
                {marketsWithoutSupply.map((m) => {
                  return (
                    <MarketSupplyRow market={m} key={m.id}>
                      <td className="flex px-8 py-6 text-left text-white font-nova font-normal items-center h-full">
                        <img
                          className="w-9 mr-2"
                          src={m.tokenPair.token.icon}
                          alt={m.tokenPair.token.symbol}
                        />
                        {m.tokenPair.token.symbol}
                      </td>
                      <td className="px-8 py-6 text-left text-white font-nova font-normal">
                        {m.marketData.depositApy}
                      </td>
                      <td className="px-8 py-6 text-left whitespace-nowrap text-white font-nova font-normal">
                        <div>
                          {toShortCryptoString(m.walletBalance)}{" "}
                          {m.tokenPair.token.symbol}
                        </div>
                        <div className="bg-dark-green text-dark-green rounded-md text-xs text-center py-1 px-2 inline-block whitespace-nowrap">
                          {toShortFiatString(
                            m.walletBalance * m.tokenPair.token.priceInUsd
                          )}{" "}
                          USD
                        </div>
                      </td>
                    </MarketSupplyRow>
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
                  <th className="pb-4 px-8 text-left">Assets</th>
                  <th className="pb-4 px-8 text-left whitespace-nowrap">
                    APY / Accrued
                  </th>
                  <th className="pb-4 px-8 text-left">Balance</th>
                  <th className="pb-4 px-8 text-left whitespace-nowrap">
                    % of Limit
                  </th>
                </tr>
              </thead>

              <tbody>
                {marketsWithBorrow.map((m) => {
                  return (
                    <MarketBorrowRow market={m} key={m.id}>
                      <td className="flex px-8 py-6 text-left items-center h-full text-white font-nova font-normal">
                        <img
                          className="w-9 mr-2"
                          src={m.tokenPair.token.icon}
                          alt={m.tokenPair.token.symbol}
                        />
                        <span>{m.tokenPair.token.symbol}</span>
                      </td>
                      <td className="px-8 py-6 text-left">
                        {m.marketData.borrowApy}
                      </td>
                      <td className="px-8 py-6 text-left whitespace-nowrap">
                        <div>
                          {toShortCryptoString(m.borrowBalance)}{" "}
                          {m.tokenPair.token.symbol}
                        </div>

                        <div className="bg-dark-green text-dark-green rounded-md text-xs text-center py-1 px-2 inline-block whitespace-nowrap">
                          {m.borrowBalanceInUsd.toFixed(2)} {"USD"}
                        </div>
                      </td>

                      <td className="px-8 py-6 text-left text-brand-green font-bold">
                        {m.borrowLimitUsedOfToken}%
                      </td>
                    </MarketBorrowRow>
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
                <tr className="text-xs text-[#818987] font-nova font-semibolt">
                  <th className="pb-4 px-8 text-left">Asset</th>
                  <th className="pb-4 px-8 text-left whitespace-nowrap">
                    APY / Accrued
                  </th>

                  <th className="pb-4 px-8 text-left">Liquidity</th>
                </tr>
              </thead>

              <tbody>
                {marketsWithoutBorrow.map((m) => {
                  return (
                    <MarketBorrowRow market={m} key={m.id}>
                      <td className="flex px-8 py-6 text-left items-center h-full text-white font-nova font-normal">
                        <img
                          className="w-9 mr-2"
                          src={m.tokenPair.token.icon}
                          alt={m.tokenPair.token.symbol}
                        />
                        {m.tokenPair.token.symbol}
                      </td>
                      <td className="px-8 py-6 text-left text-white font-nova font-normal">
                        {m.marketData.borrowApy}
                      </td>
                      <td className="px-8 py-6 text-left whitespace-nowrap text-white font-nova font-normal">
                        <div>
                          {toShortCryptoString(m.maxBorrowLiquidity)}{" "}
                          {m.tokenPair.token.symbol}
                        </div>
                        <div className="bg-dark-green text-dark-green text-xs rounded-md text-center py-1 px-2 inline-block whitespace-nowrap">
                          {toShortFiatString(
                            m.maxBorrowLiquidity * m.tokenPair.token.priceInUsd
                          )}{" "}
                          USD
                        </div>
                      </td>
                    </MarketBorrowRow>
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
