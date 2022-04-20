import { SwapRow, SwapRowMarketDatum, TokenPair } from "~/types/global";
import { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";

import Repay from "~/components/borrow-flow/repay";
import Borrow from "~/components/borrow-flow/borrow";

import { useWeb3Signer } from "~/hooks/use-web3-signer";

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

export default function BorrowFlow({
  closeModal,
  row,
  marketData,
  tokenPairs,
}: Props) {
  let [isRepaying, setIsRepaying] = useState<boolean>(false);
  let [walletBalance, setWalletBalance] = useState<string>("0");
  let [borrowLimit, setBorrowLimit] = useState<number>(0);
  let [borrowLimitUsed, setBorrowLimitUsed] = useState<string>("");
  let [borrowedAmount, setBorrowedAmount] = useState<number>(0);
  let [formattedBorrowedAmount, setFormattedBorrowedAmount] =
    useState<string>("0");
  let [totalBorrowedAmount, setTotalBorrowedAmount] = useState<BigNumber>(
    BigNumber.from(0)
  );

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
      getBorrowedAmount(signer, row.cToken).then((b) => {
        setBorrowedAmount(b);

        // TODO: We do this formatting in several places, should be abstracted into a function
        const formattedAmount = (b / 1e18).toFixed(2).toString();
        setFormattedBorrowedAmount(formattedAmount);
      });
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

  return isRepaying ? (
    <Repay
      row={row}
      marketData={marketData}
      closeModal={closeModal}
      setIsRepaying={setIsRepaying}
      formattedBorrowedAmount={formattedBorrowedAmount}
      signer={signer}
      borrowLimitUsed={borrowLimitUsed}
      walletBalance={walletBalance}
    />
  ) : (
    <Borrow
      row={row}
      marketData={marketData}
      closeModal={closeModal}
      setIsRepaying={setIsRepaying}
      formattedBorrowedAmount={formattedBorrowedAmount}
      signer={signer}
      borrowLimitUsed={borrowLimitUsed}
      walletBalance={walletBalance}
    />
  );
}
