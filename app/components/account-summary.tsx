import { useTotalSupplyBalanceInUsd } from "~/hooks/use-total-supply-balance-in-usd";
import { useNetApy } from "~/hooks/use-net-apy";
import { useWeb3Signer } from "~/hooks/use-web3-signer";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";
import { TenderContext } from "~/contexts/tender-context";
import { useContext, useRef, useLayoutEffect } from "react";
import { useTotalBorrowed } from "~/hooks/use-total-borrowed";
import { useBorrowLimit } from "~/hooks/use-borrow-limit";
import { useBorrowLimitUsed } from "~/hooks/use-borrow-limit-used";

const formatCurrency = (v: number): string => {
  return `$${v.toFixed(2)}`;
};

export default function AccountSummary() {
  let provider = Web3Hooks.useProvider();
  const signer = useWeb3Signer(provider);
  let { tokenPairs, networkData } = useContext(TenderContext);

  let totalSupplyBalanceInUsd = useTotalSupplyBalanceInUsd();
  let netApy = useNetApy(signer, tokenPairs);
  let borrowBalance = useTotalBorrowed(signer, tokenPairs);
  let borrowLimit = useBorrowLimit(
    signer,
    networkData.Contracts.Comptroller,
    tokenPairs
  );
  let borrowLimitUsed = useBorrowLimitUsed(borrowBalance, borrowLimit);

  let leftLineRef = useRef(null);
  let rightLineRef = useRef(null);

  // Size the neon green bar
  useLayoutEffect(() => {
    if (!borrowBalance || !leftLineRef.current || !rightLineRef.current) {
      return;
    }

    let leftEl = leftLineRef.current as HTMLDivElement;
    let rightEl = rightLineRef.current as HTMLDivElement;

    let w = (rightEl.clientWidth * (parseFloat(borrowLimitUsed) / 100)).toFixed(
      1
    );
    leftEl.style.width = `${w}px`;
  }, [borrowLimitUsed]);

  return (
    <div className="max-w-4xl m-auto mb-24">
      <div className="flex mb-16">
        <div className="w-1/3 flex flex-col justify-center">
          <div className="text-brand-green">Supply Balance</div>{" "}
          <div className="text-3xl">
            {formatCurrency(totalSupplyBalanceInUsd)}
          </div>
        </div>
        <div className="w-1/3 flex justify-center">
          <div className="bg-gray-800 rounded-full w-52 h-52  justify-start border-2 border-gray-500">
            <div className="flex flex-col h-full justify-center items-center">
              <div className="uppercase text-gray-400 text-sm">Net APY</div>
              <div className="text-5xl font-light">{netApy.toFixed(2)}%</div>
            </div>
          </div>
        </div>
        <div className="w-1/3 text-right  flex flex-col justify-center">
          <div className="text-brand-blue">Borrow Balance</div>{" "}
          <div className="text-3xl">{formatCurrency(borrowBalance)}</div>
        </div>
      </div>
      <div className="flex text-xs justify-center items-center">
        <div className=" text-gray-400 mr-2">Borrow Limit</div>
        <div className="mr-2">0%</div>
        <div className="bg-green-300 mr-2 h-0.5" ref={leftLineRef}></div>
        <div className="mr-2">{borrowLimitUsed}%</div>
        <div
          className="bg-gray-300 mr-2 h-0.5 flex-grow"
          ref={rightLineRef}
        ></div>
        <div>{borrowLimit}</div>
      </div>
    </div>
  );
}
