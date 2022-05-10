import type { Market } from "~/types/global";
import { useState } from "react";

import { hooks as Web3Hooks } from "~/connectors/meta-mask";
import { useWeb3Signer } from "~/hooks/use-web3-signer";

import Deposit from "~/components/deposit-flow/deposit";
import Withdraw from "~/components/deposit-flow/withdraw";

interface Props {
  closeModal: Function;
  market: Market;
}

export default function DepositFlow({ closeModal, market }: Props) {
  let [isSupplying, setIsSupplying] = useState<boolean>(true);

  let provider = Web3Hooks.useProvider();
  const signer = useWeb3Signer(provider);

  return isSupplying ? (
    <Deposit
      closeModal={closeModal}
      market={market}
      setIsSupplying={setIsSupplying}
      borrowLimit={market.borrowLimit}
      borrowLimitUsed={market.borrowLimitUsed}
      signer={signer}
      walletBalance={market.walletBalance}
      totalBorrowedAmountInUsd={market.totalBorrowedAmountInUsd}
      comptrollerAddress={market.comptrollerAddress}
    />
  ) : (
    <Withdraw
      market={market}
      closeModal={closeModal}
      setIsSupplying={setIsSupplying}
      borrowLimit={market.borrowLimit}
      borrowLimitUsed={market.borrowLimitUsed}
      signer={signer}
      walletBalance={market.walletBalance}
      totalBorrowedAmountInUsd={market.totalBorrowedAmountInUsd}
    />
  );
}
