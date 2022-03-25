import { SwapRow, SwapRowMarketDatum } from "~/types/global";
import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";

import Deposit from "~/components/deposit-flow/deposit";
import Withdraw from "~/components/deposit-flow/withdraw";

import {
  getWalletBalance,
  getBorrowLimit,
  getBorrowedAmount,
  getBorrowLimitUsed,
} from "~/lib/tender";

interface Props {
  closeModal: Function;
  row: SwapRow;
  marketData: SwapRowMarketDatum;
}

export default function DepositFlow({ closeModal, row, marketData }: Props) {
  let [isSupplying, setIsSupplying] = useState<boolean>(true);
  let [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  let [walletBalance, setWalletBalance] = useState<string>("0");
  let [borrowLimit, setBorrowLimit] = useState<number>(0);
  let [borrowLimitUsed, setBorrowLimitUsed] = useState<number>(0);
  let [borrowedAmount, setBorrowedAmount] = useState<number>(0);

  const { library } = useWeb3React<Web3Provider>();

  useEffect(() => {
    if (!library) {
      // DO we need to reset signer if null here?
      return;
    }
    let signer = library.getSigner();
    setSigner(signer);
    if (signer && row.token) {
      getWalletBalance(signer, row.token).then((b) => setWalletBalance(b));
      getBorrowLimit(signer, row.comptrollerAddress, row.cToken).then((b) =>
        setBorrowLimit(b)
      );
      getBorrowedAmount(signer, row.cToken).then((b) => setBorrowedAmount(b));
    }
  }, [library]);

  useEffect(() => {
    if (!borrowedAmount || !borrowLimit) {
      return;
    }

    getBorrowLimitUsed(borrowedAmount, borrowLimit).then((b) =>
      setBorrowLimitUsed(b)
    );
  }, [borrowedAmount, borrowLimit]);

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
