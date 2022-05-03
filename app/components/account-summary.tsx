import { useTotalSupplyBalanceInUsd } from "~/hooks/use-total-supply-balance-in-usd";
import { useNetApy } from "~/hooks/use-net-apy";
import { useWeb3Signer } from "~/hooks/use-web3-signer";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";
import { TenderContext } from "~/contexts/tender-context";
import { useContext } from "react";
import { useTotalBorrowed } from "~/hooks/use-total-borrowed";
import { useBorrowLimit } from "~/hooks/use-borrow-limit";

export default function AccountSummary() {
  let provider = Web3Hooks.useProvider();
  const signer = useWeb3Signer(provider);
  let { tokenPairs, networkData } = useContext(TenderContext);

  let totalSupplyBalanceInUsd = useTotalSupplyBalanceInUsd();
  let netApy = useNetApy(signer, tokenPairs);
  let borrowbalance = useTotalBorrowed(signer, tokenPairs);
  let borrowLimit = useBorrowLimit(
    signer,
    networkData.Contracts.Comptroller,
    tokenPairs
  );

  return (
    <div className="max-w-4xl m-auto mb-24">
      <div className="flex mb-16">
        <div className="w-1/3 flex flex-col justify-center">
          <div className="text-brand-green">Supply Balance</div>{" "}
          <div className="text-3xl">{totalSupplyBalanceInUsd}</div>
        </div>
        <div className="w-1/3">
          <div className="bg-gray-800 rounded-full w-52 h-52  justify-start border border-gray-100">
            <div className="flex flex-col h-full justify-center items-center">
              <div className="uppercase text-gray-400 text-sm">Net APY</div>
              <div className="text-5xl font-light">{netApy.toFixed(2)}%</div>
            </div>
          </div>
        </div>
        <div className="w-1/3 text-right  flex flex-col justify-center">
          <div className="text-brand-blue">Borrow Balance</div>{" "}
          <div className="text-3xl">{borrowbalance}</div>
        </div>
      </div>
      <div className="flex text-xs justify-center items-center">
        <div className=" text-gray-400 mr-2">Borrow Limit</div>
        <div className="mr-2">0%</div>
        <div className="bg-green-300 mr-2 h-0.5 w-96"></div>
        <div>30%</div>
        <div className="bg-gray-300 mr-2 h-0.5 flex-grow"></div>
        <div>{borrowLimit}</div>
      </div>
    </div>
  );
}
