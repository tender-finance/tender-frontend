import type { SwapRow, SwapRowMarketDatum, TokenPair } from "~/types/global";
import { useEffect, useState } from "react";
import { BigNumber } from "ethers";

import { hooks as Web3Hooks } from "~/connectors/meta-mask";
import { useWeb3Signer } from "~/hooks/use-web3-signer";

import Deposit from "~/components/deposit-flow/deposit";
import Withdraw from "~/components/deposit-flow/withdraw";

import {
  getWalletBalance,
  getBorrowLimit,
  getBorrowedAmount,
  getBorrowLimitUsed,
  getTotalBorrowed,
} from "~/lib/tender";

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
  let [walletBalance, setWalletBalance] = useState<number>(0);
  let [borrowLimit, setBorrowLimit] = useState<number>(0);
  let [borrowLimitUsed, setBorrowLimitUsed] = useState<string>("");
  let [borrowedAmount, setBorrowedAmount] = useState<number>(0);
  let [totalBorrowedAmount, setTotalBorrowedAmount] = useState<number>(0);

  let provider = Web3Hooks.useProvider();
  const signer = useWeb3Signer(provider);

  useEffect(() => {
    if (!signer) {
      // DO we need to reset signer if null here?
      return;
    }

    if (signer && row.token) {
      getWalletBalance(signer, row.token).then((b) => setWalletBalance(b));

      getBorrowLimit(signer, row.comptrollerAddress, tokenPairs).then((b) =>
        setBorrowLimit(b)
      );
      getBorrowedAmount(signer, row.cToken).then((b) => setBorrowedAmount(b));
      getTotalBorrowed(signer, tokenPairs).then((b) =>
        setTotalBorrowedAmount(b)
      );
    }
  }, [signer, row.cToken, row.comptrollerAddress, row.token, tokenPairs]);

  useEffect(() => {
    if (!borrowedAmount || !borrowLimit) {
      return;
    }

    getBorrowLimitUsed(totalBorrowedAmount, borrowLimit).then((b) =>
      setBorrowLimitUsed(b)
    );
  }, [borrowedAmount, borrowLimit, totalBorrowedAmount]);

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
    />
  );
}
