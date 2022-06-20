import { useContext } from "react";
import { TenderContext } from "~/contexts/tender-context";
import MarketSupplyRow from "~/components/two-panes/market-supply-row";
import MarketBorrowRow from "~/components/two-panes/market-borrow-row";
import { toShortFiatString, toShortCryptoString } from "~/lib/ui";

export default function TwoPanes() {
  let { markets } = useContext(TenderContext);

  // markets with less than this amount are shown as not actively supplying or borrowing
   const DUST_LIMIT = 0.01;

  const marketsWithSupply = markets.filter((m) => m.supplyBalance && m.supplyBalanceInUsd > DUST_LIMIT);

  const marketsWithBorrow = markets.filter((m) => m.borrowBalance && m.borrowBalanceInUsd > DUST_LIMIT);

  const marketsWithoutBorrow = markets.filter((m) => !m.borrowBalance || m.borrowBalanceInUsd <= DUST_LIMIT);

  const marketsWithoutSupply = markets.filter((m) => !m.supplyBalance || m.supplyBalanceInUsd <= DUST_LIMIT);

  return (
    <div className="grid grid-cols-2 gap-9 mb-14">
      {/* Supply */}

      <div>
        {/* Empty state heading for borrow */}
        {marketsWithSupply.length == 0 && (
          <div className="py-6 text-brand-green text-2xl  mb-4">Supply</div>
        )}
        {marketsWithSupply.length > 0 && (
          <div className="pane mb-9 ">
            <div className="px-8 py-6 text-brand-green text-2xl border-b border-b-gray-600 mb-4">
              Supply
            </div>
            <table className="w-full h-full table-fixed">
              <thead>
                <tr className="text-xs text-gray-400 ">
                  <th className="pb-4 px-8 text-left">Asset</th>
                  <th className="pb-4 px-8 text-left">APY</th>
                  <th className="pb-4 px-8 text-left">Balance</th>
                </tr>
              </thead>

              <tbody>
                {marketsWithSupply.map((m) => {
                  return (
                    <MarketSupplyRow market={m} key={m.id}>
                      <td className="flex px-8 py-6 text-left items-center h-full">
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
                          {toShortCryptoString(m.supplyBalance)} {m.tokenPair.token.symbol}
                        </div>
                        <div className="bg-black rounded-lg text-xs text-gray-300 text-center py-1 px-2 inline-block whitespace-nowrap">
                          {m.supplyBalanceInUsd.toFixed(2)}{" USD"}
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
          <div className="mb-3 text-gray-400 text-xl">All Markets</div>
        )}
        {marketsWithoutSupply.length > 0 && (
          <div className="pane py-6">
            <table className="w-full h-full table-fixed">
              <thead>
                <tr className="text-xs text-gray-400 ">
                  <th className="pb-4 px-8 text-left">Asset</th>
                  <th className="pb-4 px-8 text-left">APY</th>
                  <th className="pb-4 px-8 text-left">Wallet</th>
                </tr>
              </thead>

              <tbody>
                {marketsWithoutSupply.map((m) => {
                  return (
                    <MarketSupplyRow market={m} key={m.id}>
                      <td className="flex px-8 py-6 text-left items-center h-full">
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
                          {toShortCryptoString(m.walletBalance)}{" "}
                          {m.tokenPair.token.symbol}
                        </div>
                        <div className="bg-black rounded-lg text-xs text-gray-300 text-center py-1 px-2 inline-block whitespace-nowrap">
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
          <div className="py-6 text-brand-blue text-2xl  mb-4">Borrowing</div>
        )}
        {marketsWithBorrow.length > 0 && (
          <div className="pane mb-9 ">
            <div className="px-8 py-6 text-brand-blue text-2xl border-b border-b-gray-600 mb-4">
              Borrowing
            </div>
            <table className="w-full h-full table-fixed">
              <thead>
                <tr className="text-xs text-gray-400 ">
                  <th className="pb-4 px-8 text-left">Assets</th>
                  <th className="pb-4 px-8 text-left whitespace-nowrap">
                    APY
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
                      <td className="flex px-8 py-6 text-left items-center h-full">
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
                          {toShortCryptoString(m.borrowBalance)} {m.tokenPair.token.symbol}                        
                        </div>

                        <div className="bg-black rounded-lg text-xs text-gray-300 text-center py-1 px-2 inline-block whitespace-nowrap">
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
          <div className="mb-3 text-gray-400 text-xl">All Markets</div>
        )}
        {marketsWithoutBorrow.length > 0 && (
          <div className="pane py-6">
            <table className="w-full h-full table-fixed">
              <thead>
                <tr className="text-xs text-gray-400 ">
                  <th className="pb-4 px-8 text-left">Asset</th>
                  <th className="pb-4 px-8 text-left whitespace-nowrap">
                    APY
                  </th>
                  <th className="pb-4 px-8 text-left">Liquidity</th>
                </tr>
              </thead>

              <tbody>
                {marketsWithoutBorrow.map((m) => {
                  return (
                    <MarketBorrowRow market={m} key={m.id}>
                      <td className="flex px-8 py-6 text-left items-center h-full">
                        <img
                          className="w-9 mr-2"
                          src={m.tokenPair.token.icon}
                          alt={m.tokenPair.token.symbol}
                        />
                        {m.tokenPair.token.symbol}
                      </td>
                      <td className="px-8 py-6 text-left">
                        {m.marketData.borrowApy}
                      </td>
                      <td className="px-8 py-6 text-left whitespace-nowrap">
                        <div>
                          {toShortCryptoString(m.maxBorrowLiquidity)}{" "}
                          {m.tokenPair.token.symbol}
                        </div>
                        <div className="bg-black rounded-lg text-xs text-gray-300 text-center py-1 px-2 inline-block whitespace-nowrap">
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
