import type { SwapRow, SwapRowMarketDatum, TokenPair } from "~/types/global";
import { useState } from "react";

import { hooks as Web3Hooks } from "~/connectors/meta-mask";
import { useWeb3Signer } from "~/hooks/use-web3-signer";

import Deposit from "~/components/deposit-flow/deposit";
import Withdraw from "~/components/deposit-flow/withdraw";

import { useWalletBalance } from "~/hooks/use-wallet-balance";
import { useBorrowLimit } from "~/hooks/use-borrow-limit";
import { useTotalBorrowed } from "~/hooks/use-total-borrowed";
import { useBorrowLimitUsed } from "~/hooks/use-borrow-limit-used";

interface Props {
  closeModal: Function;
  row: SwapRow;
  tokenPairs: TokenPair[];
  marketData: SwapRowMarketDatum;
}

export default function DepositFlow({
  closeModal,
  row,
  marketData,
  tokenPairs,
}: Props) {
  let [isSupplying, setIsSupplying] = useState<boolean>(true);

  let provider = Web3Hooks.useProvider();
  const signer = useWeb3Signer(provider);
  let walletBalance = useWalletBalance(signer, row.token);
  let borrowLimit = useBorrowLimit(signer, row.comptrollerAddress, tokenPairs);
  let totalBorrowedAmount = useTotalBorrowed(signer, tokenPairs);
  let borrowLimitUsed = useBorrowLimitUsed(totalBorrowedAmount, borrowLimit);

  return isSupplying ? (
    <Deposit
      row={row}
      closeModal={closeModal}
      marketData={marketData}
      setIsSupplying={setIsSupplying}
      borrowLimit={borrowLimit}
      borrowLimitUsed={borrowLimitUsed}
      signer={signer}
      walletBalance={walletBalance}
      tokenPairs={tokenPairs}
      totalBorrowedAmount={totalBorrowedAmount}
    />
  ) : (
    <Withdraw
      row={row}
      closeModal={closeModal}
      marketData={marketData}
      setIsSupplying={setIsSupplying}
      borrowLimit={borrowLimit}
      borrowLimitUsed={borrowLimitUsed}
      signer={signer}
      walletBalance={walletBalance}
      tokenPairs={tokenPairs}
      totalBorrowedAmount={totalBorrowedAmount}
    />
  );
}
