import type { SwapRow, SwapRowMarketDatum, TokenPair } from "~/types/global";
import { useState } from "react";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";

import Repay from "~/components/borrow-flow/repay";
import Borrow from "~/components/borrow-flow/borrow";

import { useWeb3Signer } from "~/hooks/use-web3-signer";
import { useWalletBalance } from "~/hooks/use-wallet-balance";
import { useBorrowLimit } from "~/hooks/use-borrow-limit";
import { useBorrowedAmount } from "~/hooks/use-borrowed-amount";
import { useTotalBorrowed } from "~/hooks/use-total-borrowed";
import { useBorrowLimitUsed } from "~/hooks/use-borrow-limit-used";

interface Props {
  closeModal: Function;
  row: SwapRow;
  tokenPairs: TokenPair[];
  marketData: SwapRowMarketDatum;
}

// TODO: move to tender.ts and do something more dynamic with 1e18
const formattedAmount = (b: number): string => (b / 1e18).toFixed(2).toString();

export default function BorrowFlow({
  closeModal,
  row,
  marketData,
  tokenPairs,
}: Props) {
  let [isRepaying, setIsRepaying] = useState<boolean>(false);

  let provider = Web3Hooks.useProvider();
  const signer = useWeb3Signer(provider);
  let walletBalance = useWalletBalance(signer, row.token);
  let borrowLimit = useBorrowLimit(signer, row.comptrollerAddress, tokenPairs);
  let borrowedAmount = useBorrowedAmount(signer, row.cToken);
  let totalBorrowedAmount = useTotalBorrowed(signer, tokenPairs);
  let borrowLimitUsed = useBorrowLimitUsed(totalBorrowedAmount, borrowLimit);

  return isRepaying ? (
    <Repay
      row={row}
      marketData={marketData}
      closeModal={closeModal}
      setIsRepaying={setIsRepaying}
      formattedBorrowedAmount={formattedAmount(borrowedAmount)}
      signer={signer}
      borrowLimitUsed={borrowLimitUsed}
      walletBalance={walletBalance}
      tokenPairs={tokenPairs}
      borrowLimit={borrowLimit}
      totalBorrowedAmount={totalBorrowedAmount}
    />
  ) : (
    <Borrow
      row={row}
      marketData={marketData}
      closeModal={closeModal}
      setIsRepaying={setIsRepaying}
      signer={signer}
      borrowLimitUsed={borrowLimitUsed}
      borrowLimit={borrowLimit}
      walletBalance={walletBalance}
      tokenPairs={tokenPairs}
      totalBorrowedAmount={totalBorrowedAmount}
    />
  );
}
