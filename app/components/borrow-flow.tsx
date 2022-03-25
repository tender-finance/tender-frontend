import { cToken, SwapRow, Token, SwapRowMarketDatum } from "~/types/global";
import { useEffect, useState } from "react";
import { Signer } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";

import clsx from "clsx";
import toast from "react-hot-toast";

import {
  getWalletBalance,
  enable,
  getCurrentlyBorrowing,
  getBorrowLimit,
  getBorrowedAmount,
  getBorrowLimitUsed,
} from "~/lib/tender";

interface Props {
  closeModal: Function;
  row: SwapRow;
  marketData: SwapRowMarketDatum;
}

export default function BorrowFlow({ closeModal, row, marketData }: Props) {
  let [isRepaying, setIsRepaying] = useState<boolean>(false);
  let [isEnabled, setIsEnabled] = useState<boolean>(false);
  let [signer, setSigner] = useState<JsonRpcSigner | null>(null);
  let [value, setValue] = useState<string>("");
  let [walletBalance, setWalletBalance] = useState<string>("0");
  let [currentlyBorrowing, setCurrentlyBorrowing] = useState<string>("0");
  let [borrowLimit, setBorrowLimit] = useState<number>(0);
  let [borrowLimitUsed, setBorrowLimitUsed] = useState<number>(0);
  let [borrowedAmount, setBorrowedAmount] = useState<number>(0);
  let [formattedBorrowedAmount, setFormattedBorrowedAmount] =
    useState<string>("0");

  let [isEnabling, setIsEnabling] = useState<boolean>(false);
  let [isBorrowing, setIsBorrowing] = useState<boolean>(false);
  let [isRepayingTxn, setIsRepayingTxn] = useState<boolean>(false);

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

      getCurrentlyBorrowing(signer, row.cToken).then((c) =>
        setCurrentlyBorrowing(c)
      );

      getBorrowLimit(signer, row.comptrollerAddress, row.cToken).then((b) =>
        setBorrowLimit(b)
      );
      getBorrowedAmount(signer, row.cToken).then((b) => {
        setBorrowedAmount(b);

        // TODO: We do this formatting in several places, should be abstracted into a function
        const formattedAmount = (b / 1e18).toFixed(2).toString();
        setFormattedBorrowedAmount(formattedAmount);
      });
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

  return isRepaying ? (
    <div>
      <div className="py-8" style={{ backgroundColor: "#23262B" }}>
        <div className="float-right">
          <button
            onClick={() => closeModal()}
            className="text-4xl rotate-45 text-gray-400 mr-8"
          >
            +
          </button>
        </div>
        <div className="flex align-middle justify-center items-center">
          <div className="mr-4">
            <img src={row.icon} />
          </div>
          <div>Deposit {row.name}</div>
        </div>

        {!isEnabled && (
          <div>
            <div className="mt-12 mb-6 bg-white w-16 h-16 rounded-full ml-auto mr-auto"></div>
            <div className="max-w-sm text-center m-auto mt-5 mb-5 text-sm text-gray-400">
              To borrow or repay {row.name} to the Tender Protocol, you need to
              enable it first.
            </div>
          </div>
        )}
        {isEnabled && (
          <div className="flex flex-col justify-center items-center overflow-hidden">
            <input
              onChange={(e) => setValue(e.target.value)}
              className="bg-transparent text-6xl text-white text-center outline-none"
              placeholder="0"
            />
            <div className="text-gray-400 text-sm m-auto">Max ⬆</div>
          </div>
        )}
      </div>

      <div className="flex mb-10">
        <button className="flex-grow py-3" onClick={() => setIsRepaying(false)}>
          Borrow
        </button>
        <button
          className="flex-grow py-3 text-brand-green border-b-2 border-b-brand-green"
          onClick={() => setIsRepaying(true)}
        >
          Repay
        </button>
      </div>
      <div className="py-6 px-12" style={{ background: "#1C1E22" }}>
        <div className="flex mb-4">
          <span className="font-bold mr-3">Borrow Rates</span>{" "}
          <img src="/images/box-arrow.svg" alt="box arrow" />
        </div>
        <div className="flex items-center mb-3 text-gray-400 border-b border-b-gray-600 pb-6">
          <div className="mr-3">
            <img src="/images/supply-icon.svg" />
          </div>
          <div className="flex-grow">Borrow APY</div>
          <div>{marketData.borrowApy}</div>
        </div>
        <div className="flex items-center text-gray-400 pt-4 pb-8">
          <div className="mr-3">
            <img src="/images/distribution-icon.svg" />
          </div>
          <div className="flex-grow">Distribution APY</div>
          <div>0%</div>
        </div>

        <div>
          <div className="font-bold mr-3 border-b border-b-gray-600 w-full pb-5">
            Borrow Limit
          </div>
          <div className="flex items-center mb-3 text-gray-400 border-b border-b-gray-600 py-5">
            <div className="flex-grow">Borrow Balance</div>
            <div>${formattedBorrowedAmount}</div>
          </div>
          <div className="flex items-center mb-3 text-gray-400 border-b border-b-gray-600 py-5">
            <div className="flex-grow">Borrow Limit Used</div>
            <div>
              0 <span className="text-brand-green">→</span>&nbsp;
              {borrowLimitUsed}%
            </div>
          </div>
        </div>
        <div className="mb-8">
          {!signer && <div>Connect wallet to get started</div>}
          {signer && !isEnabled && (
            <button
              onClick={async () => {
                try {
                  setIsEnabling(true);
                  // @ts-ignore existence of signer is gated above.
                  await enable(signer, row.token, row.cToken);
                  setIsEnabled(true);
                } catch (e) {
                  console.error(e);
                } finally {
                  setIsEnabling(false);
                }
              }}
              className={clsx(
                "py-4 text-center text-white font-bold rounded bg-brand-green w-full",
                {
                  "bg-brand-green": !isEnabling,
                  "bg-gray-200": isEnabling,
                }
              )}
            >
              {isEnabling ? "Enabling..." : "Enable"}
            </button>
          )}

          {signer && isEnabled && (
            <button
              onClick={async () => {
                try {
                  if (!value) {
                    toast("Please set a value", {
                      icon: "⚠️",
                    });
                    return;
                  }

                  setIsRepayingTxn(true);
                  // @ts-ignore existence of signer is gated above.
                  await repay(value, signer, row.cToken);
                  setValue("");
                  toast.success("Repayment successful");
                  closeModal();
                } catch (e) {
                  toast.error("Repayment unsuccessful");
                  console.error(e);
                } finally {
                  setIsRepayingTxn(false);
                }
              }}
              className={clsx(
                "py-4 text-center text-white font-bold rounded bg-brand-green w-full",
                {
                  "bg-brand-green": !isRepayingTxn,
                  "bg-gray-200": isRepayingTxn,
                }
              )}
            >
              {isRepayingTxn ? "Repaying..." : "Repay"}
            </button>
          )}
        </div>

        <div className="flex text-gray-500">
          <div className="flex-grow">Wallet Balance</div>
          <div>
            {walletBalance} {row.name}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>
      <div>
        <div className="py-8" style={{ backgroundColor: "#23262B" }}>
          <div className="float-right">
            <button
              onClick={() => closeModal()}
              className="text-4xl rotate-45 text-gray-400 mr-8"
            >
              +
            </button>
          </div>
          <div className="flex align-middle justify-center items-center">
            <div className="mr-4">
              <img src={row.icon} />
            </div>
            <div>Deposit {row.name}</div>
          </div>

          <div className="flex flex-col justify-center items-center overflow-hidden">
            <input
              onChange={(e) => setValue(e.target.value)}
              className="bg-transparent text-6xl text-white text-center outline-none"
              placeholder="0"
            />
            <div className="text-gray-400 text-sm m-auto">Max ⬆</div>
          </div>
        </div>
        <div className="flex">
          <button
            className="flex-grow py-3 text-brand-green border-b-2 border-b-brand-green"
            onClick={() => setIsRepaying(false)}
          >
            Borrow
          </button>
          <button
            className="flex-grow py-3"
            onClick={() => setIsRepaying(true)}
          >
            Repay
          </button>
        </div>
        <div className="py-8" style={{ background: "#1C1E22" }}>
          <div className="py-6 px-12" style={{ background: "#1C1E22" }}>
            <div className="flex mb-4">
              <span className="font-bold mr-3">Borrow Rates</span>{" "}
              <img src="/images/box-arrow.svg" alt="box arrow" />
            </div>
            <div className="flex items-center mb-3 text-gray-400 border-b border-b-gray-600 pb-6">
              <div className="mr-3">
                <img src="/images/supply-icon.svg" />
              </div>
              <div className="flex-grow">Borrow APY</div>
              <div>{marketData.borrowApy}</div>
            </div>
            <div className="flex items-center text-gray-400 pt-4 pb-8">
              <div className="mr-3">
                <img src="/images/distribution-icon.svg" />
              </div>
              <div className="flex-grow">Distribution APY</div>
              <div>0%</div>
            </div>
            <div>
              <div className="font-bold mr-3 border-b border-b-gray-600 w-full pb-5">
                Borrow Limit
              </div>
              <div className="flex items-center mb-3 text-gray-400 border-b border-b-gray-600 py-5">
                <div className="flex-grow">Borrow Balance</div>
                <div>${formattedBorrowedAmount}</div>
              </div>
              <div className="flex items-center mb-3 text-gray-400 border-b border-b-gray-600 py-5">
                <div className="flex-grow">Borrow Limit Used</div>
                <div>
                  0 <span className="text-brand-green">→</span>&nbsp;
                  {borrowLimitUsed}%
                </div>
              </div>
            </div>

            <div className="mb-8">
              {!signer && <div>Connect wallet to get started</div>}
              {signer && (
                <button
                  onClick={async () => {
                    try {
                      if (!value) {
                        toast("Please set a value", {
                          icon: "⚠️",
                        });
                        return;
                      }
                      setIsBorrowing(true);
                      // @ts-ignore existence of signer is gated above.
                      await borrow(value, signer, row.cToken);
                      setValue("");
                      toast.success("Borrow successful");
                      closeModal();
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setIsBorrowing(false);
                    }
                  }}
                  className={clsx(
                    "py-4 text-center text-white font-bold rounded bg-brand-green w-full",
                    {
                      "bg-brand-green": !isBorrowing,
                      "bg-gray-200": isBorrowing,
                    }
                  )}
                >
                  {isBorrowing ? "Borrowing..." : "Borrow"}
                </button>
              )}
            </div>

            <div className="flex text-gray-500">
              <div className="flex-grow">Currently Borrowing</div>
              <div>
                {currentlyBorrowing} {row.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
