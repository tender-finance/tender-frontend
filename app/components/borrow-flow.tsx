import type { Market } from "~/types/global";
import { useContext, useState } from "react";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";

import Repay from "~/components/borrow-flow/repay";
import Borrow from "~/components/borrow-flow/borrow";

import { useWeb3Signer } from "~/hooks/use-web3-signer";
import { TenderContext } from "~/contexts/tender-context";

interface Props {
  closeModal: Function;
  market: Market;
}

export default function BorrowFlow({ closeModal, market }: Props) {
  let [isRepaying, setIsRepaying] = useState<boolean>(false);

  let { tokenPairs } = useContext(TenderContext);

  let provider = Web3Hooks.useProvider();
  const signer = useWeb3Signer(provider);

  return isRepaying ? (
    <Repay
      market={market}
      closeModal={closeModal}
      setIsRepaying={setIsRepaying}
      borrowedAmount={market.borrowBalance}
      signer={signer}
      borrowLimitUsed={market.borrowLimitUsed}
      walletBalance={market.walletBalance}
      tokenPairs={tokenPairs}
      borrowLimit={market.borrowLimit}
      totalBorrowedAmountInUsd={market.totalBorrowedAmountInUsd}
    />
  ) : (
    <Borrow
      market={market}
      closeModal={closeModal}
      setIsRepaying={setIsRepaying}
      signer={signer}
      borrowLimitUsed={market.borrowLimitUsed}
      borrowLimit={market.borrowLimit}
      walletBalance={market.walletBalance}
      tokenPairs={tokenPairs}
      totalBorrowedAmountInUsd={market.totalBorrowedAmountInUsd}
    />
  );
}
