import { useTotalSupplyBalanceInUsd } from "~/hooks/use-total-supply-balance-in-usd";
import { useNetApy } from "~/hooks/use-net-apy";
import { useWeb3Signer } from "~/hooks/use-web3-signer";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";
import { TenderContext } from "~/contexts/tender-context";
import { useContext } from "react";
import { useTotalBorrowedInUsd } from "~/hooks/use-total-borrowed-in-usd";
import { useBorrowLimit } from "~/hooks/use-borrow-limit";
import { useBorrowLimitUsed } from "~/hooks/use-borrow-limit-used";
import Display from "~/components/account-summary/display";

export default function AccountSummary() {
  let provider = Web3Hooks.useProvider();
  const signer = useWeb3Signer(provider);
  let { tokenPairs, networkData } = useContext(TenderContext);

  let totalSupplyBalanceInUsd = useTotalSupplyBalanceInUsd(signer, tokenPairs);
  let netApy = useNetApy(signer, tokenPairs);
  let totalBorrowedInUsd = useTotalBorrowedInUsd(signer, tokenPairs);
  let borrowLimit = useBorrowLimit(
    signer,
    networkData.Contracts.Comptroller,
    tokenPairs
  );
  let borrowLimitUsed = useBorrowLimitUsed(totalBorrowedInUsd, borrowLimit);

  let percentUsed = Math.min(parseFloat(borrowLimitUsed), 100);

  return (
    <Display
      totalSupplyBalanceInUsd={totalSupplyBalanceInUsd}
      totalBorrowedInUsd={totalBorrowedInUsd}
      netApy={netApy}
      borrowLimitUsed={borrowLimitUsed}
      percentUsed={percentUsed}
      borrowLimit={borrowLimit}
    />
  );
}
