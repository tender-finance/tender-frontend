import { useContext } from "react";
import { TenderContext } from "~/contexts/tender-context";
export default function TwoPanes() {
  let { supplyMarkets } = useContext(TenderContext);
  console.log(supplyMarkets);
  return (
    <div className="grid grid-cols-2 gap-5">
      {/* Supply */}
      <div>
        <div className="pane mb-9 ">
          <div className="px-8 py-6 text-brand-green text-2xl border-b border-b-gray-500">
            Supply
          </div>
          <div className="border-b border-b-gray-500 py-4 text-sm text-gray-300">
            Asset / apy / balance / collateral
          </div>
          <div>Row</div>
        </div>
        <div className="pane">
          <div>all markets Supply</div>

          {supplyMarkets.map((m) => {
            return (
              <div className="flex">
                <div>
                  <img className="w-6" src={m.tokenMetaData.icon} />
                </div>
                <div>{m.tokenMetaData.name}</div>
                <div>dapy {m.marketData.depositApy} | </div>
                <div>wb: {m.walletBalance}</div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Borrowing*/}
      <div>
        <div className="pane mb-9 ">
          <div className="px-8 py-6 text-2xl text-brand-blue">Borrowing</div>
        </div>
        <div className="pane">
          <div>
            <div>all markets borrowing</div>
            {supplyMarkets.map((m) => {
              return (
                <div className="flex">
                  <div>
                    <img className="w-6" src={m.tokenMetaData.icon} />
                  </div>
                  <div>{m.tokenMetaData.name}</div>
                  <div>bapy {m.marketData.borrowApy} |</div>
                  <div>wb: {m.walletBalance}</div>
                  <div>lq: ??</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
