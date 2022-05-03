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
    <div className="hidden">
      <div>supply balance: {totalSupplyBalanceInUsd}</div>
      <div>net apy {netApy}</div>
      <div>borrow balance {borrowbalance}</div>
      <div>borrow limit {borrowLimit}</div>
      <div>borrow limited used? (percent)</div>
    </div>
  );
}
