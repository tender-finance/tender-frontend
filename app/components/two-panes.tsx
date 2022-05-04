import { useContext } from "react";
import { TenderContext } from "~/contexts/tender-context";
import { Market } from "~/types/global";
const marketsWithBorrowOrSupply = (markets: Market[]) => {
  return markets.filter((m) => m.supplyBalance || m.borrowBalance);
};
export default function TwoPanes() {
  let { markets } = useContext(TenderContext);
  return (
    <div className="grid grid-cols-2 gap-5 mb-8">
      {/* Supply */}
      <div>
        <div className="pane mb-9 ">
          <div className="px-8 py-6 text-brand-green text-2xl border-b border-b-gray-600 mb-4">
            Supply
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 ">
                <th className="pb-4 px-8 text-left">Asset</th>
                <th className="pb-4 px-8 text-left">Apy/Earned</th>
                <th className="pb-4 px-8 text-left">Balance</th>
              </tr>
            </thead>

            <tbody>
              {marketsWithBorrowOrSupply(markets).map((m) => {
                return (
                  <tr
                    key={m.id}
                    className="text-gray-400 border-t border-t-gray-600"
                  >
                    <td className="flex px-8 py-6 text-left items-center">
                      <img className="w-9 mr-2" src={m.tokenMetaData.icon} />
                      {m.tokenMetaData.name}
                    </td>
                    <td className="px-8 py-6 text-left">
                      {m.marketData.depositApy}
                    </td>
                    <td className="px-8 py-6 text-left">{m.walletBalance}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mb-3 text-gray-400 text-xl">All Markets</div>
        <div className="pane py-6">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 ">
                <th className="pb-4 px-8 text-left">Asset</th>
                <th className="pb-4 px-8 text-left">Apy/Earned</th>
                <th className="pb-4 px-8 text-left">Balance</th>
              </tr>
            </thead>

            <tbody>
              {markets.map((m) => {
                return (
                  <tr
                    key={m.id}
                    className="text-gray-400 border-t border-t-gray-600"
                  >
                    <td className="flex px-8 py-6 text-left items-center">
                      <img className="w-9 mr-2" src={m.tokenMetaData.icon} />
                      {m.tokenMetaData.name}
                    </td>
                    <td className="px-8 py-6 text-left">
                      {m.marketData.depositApy}
                    </td>
                    <td className="px-8 py-6 text-left">{m.walletBalance}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Borrowing*/}
      <div>
        <div className="pane mb-9 ">
          <div className="px-8 py-6 text-brand-blue text-2xl border-b border-b-gray-600 mb-4">
            Borrowing
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 ">
                <th className="pb-4 px-8 text-left">Asset</th>
                <th className="pb-4 px-8 text-left">Apy/Earned</th>
                <th className="pb-4 px-8 text-left">Balance</th>
                <th className="pb-4 px-8 text-left">% of Limit</th>
              </tr>
            </thead>

            <tbody>
              {marketsWithBorrowOrSupply(markets).map((m) => {
                return (
                  <tr
                    key={m.id}
                    className="text-gray-400 border-t border-t-gray-600"
                  >
                    <td className="flex px-8 py-6 text-left items-center">
                      <img className="w-9 mr-2" src={m.tokenMetaData.icon} />
                      {m.tokenMetaData.name}
                    </td>
                    <td className="px-8 py-6 text-left">
                      {m.marketData.depositApy}
                    </td>
                    <td className="px-8 py-6 text-left">{m.walletBalance}</td>
                    <td className="px-8 py-6 text-left text-brand-green font-bold">
                      {m.borrowLimitUsed}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mb-3 text-gray-400 text-xl">All Markets</div>
        <div className="pane py-6">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-400 ">
                <th className="pb-4 px-8 text-left">Asset</th>
                <th className="pb-4 px-8 text-left">Apy/Accrued</th>
                <th className="pb-4 px-8 text-left">Wallet</th>
                <th className="pb-4 px-8 text-left">Liquidity</th>
              </tr>
            </thead>

            <tbody>
              {markets.map((m) => {
                return (
                  <tr
                    key={m.id}
                    className="text-gray-400 border-t border-t-gray-600"
                  >
                    <td className="flex px-8 py-6 text-left items-center">
                      <img className="w-9 mr-2" src={m.tokenMetaData.icon} />
                      {m.tokenMetaData.name}
                    </td>
                    <td className="px-8 py-6 text-left">
                      {m.marketData.borrowApy}
                    </td>
                    <td className="px-8 py-6 text-left">{m.walletBalance}</td>
                    <td className="px-8 py-6 text-left">TODO</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
