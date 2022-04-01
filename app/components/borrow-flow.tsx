import { SwapRow, SwapRowMarketDatum, TokenPair } from "~/types/global";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";
import { BigNumber } from "ethers";

import Repay from "~/components/borrow-flow/repay";
import Borrow from "~/components/borrow-flow/borrow";

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
  let [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  let [walletBalance, setWalletBalance] = useState<string>("0");
  let [borrowLimit, setBorrowLimit] = useState<number>(0);
  let [borrowLimitUsed, setBorrowLimitUsed] = useState<string>("");
  let [borrowedAmount, setBorrowedAmount] = useState<number>(0);
  let [formattedBorrowedAmount, setFormattedBorrowedAmount] =
    useState<string>("0");
  let [totalBorrowedAmount, setTotalBorrowedAmount] = useState<BigNumber>(
    BigNumber.from(0)
  );

  const { library } = useWeb3React<Web3Provider>();

  useEffect(() => {
    if (!library) {
      // DO we need to reset signer if null here?
      return;
    }
    const signer = library.getSigner();
    setSigner(signer);

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
  }, [library]);

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
