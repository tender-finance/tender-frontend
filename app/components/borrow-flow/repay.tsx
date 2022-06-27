import { ICON_SIZE } from "~/lib/constants";
import type { Market, TokenPair } from "~/types/global";
import { useContext, useEffect, useRef, useState } from "react";
import type { JsonRpcSigner } from "@ethersproject/providers";
import * as math from "mathjs";

import clsx from "clsx";
import toast from "react-hot-toast";

import Max from "~/components/max";

import { enable, repay, hasSufficientAllowance } from "~/lib/tender";
import { useValidInput } from "~/hooks/use-valid-input";
import BorrowBalance from "../fi-modal/borrow-balance";
import { useBorrowLimitUsed } from "~/hooks/use-borrow-limit-used";

import ConfirmingTransaction from "../fi-modal/confirming-transition";
import { TenderContext } from "~/contexts/tender-context";
import { useNewTotalBorrowedAmountInUsd } from "~/hooks/use-new-total-borrowed-amount-in-usd";
import { shrinkyInputClass, toCryptoString } from "~/lib/ui";

export interface RepayProps {
  closeModal: Function;
  setIsRepaying: Function;
  signer: JsonRpcSigner | null | undefined;
  borrowedAmount: number;
  borrowLimitUsed: string;
  walletBalance: number;
  borrowLimit: number;
  tokenPairs: TokenPair[];
  totalBorrowedAmountInUsd: number;
  market: Market;
}

export default function Repay({
  market,
  closeModal,
  setIsRepaying,
  signer,
  borrowedAmount,
  borrowLimit,
  borrowLimitUsed,
  walletBalance,
  totalBorrowedAmountInUsd,
}: RepayProps) {
  let [isWaitingToBeMined, setIsWaitingToBeMined] = useState<boolean>(false);
  let [isEnabled, setIsEnabled] = useState<boolean>(true);
  let [isEnabling, setIsEnabling] = useState<boolean>(false);

  let [isRepayingTxn, setIsRepayingTxn] = useState<boolean>(false);
  let [value, setValue] = useState<string>("0");
  let [txnHash, setTxnHash] = useState<string>("");

  let maxRepayableAmount = Math.min(borrowedAmount, walletBalance);

  let inputEl = useRef<HTMLInputElement>(null);
  let inputTextClass = shrinkyInputClass(value.length);

  let newTotalBorrowedAmountInUsd = useNewTotalBorrowedAmountInUsd(
    market.tokenPair,
    totalBorrowedAmountInUsd,
    // Value is negative because you're repaying which is reducing the $ amount that you have borrowed
    -value
  );

  let newBorrowLimitUsed = useBorrowLimitUsed(
    newTotalBorrowedAmountInUsd,
    borrowLimit
  );

  let [isValid, validationDetail] = useValidInput(
    value,
    0,
    maxRepayableAmount,
    parseFloat(newBorrowLimitUsed)
  );

  let { updateTransaction } = useContext(TenderContext);

  useEffect(() => {
    if (!signer) {
      return;
    }
    hasSufficientAllowance(
      signer,
      market.tokenPair.token,
      market.tokenPair.cToken
    ).then((has: boolean) => {
      if (!has) {
        setIsEnabled(false);
      }
    });
  }, [signer, market.tokenPair.cToken, market.tokenPair.token]);

  // Highlights value input
  useEffect(() => {
    inputEl && inputEl.current && inputEl.current.select();
  }, []);

  return (
    <div>
      {isWaitingToBeMined && (
        <ConfirmingTransaction
          txnHash={txnHash}
          stopWaitingOnConfirmation={() => closeModal()}
        />
      )}

      {!isWaitingToBeMined && (
        <div>
          <div className="pt-8 bg-[#151515] relative border-[#B5CFCC2B] border-b">
            <div className="absolute right-[10px] top-[15px] sm:right-[22px] sm:top-[24px]">
              <button onClick={() => closeModal()} className="">
                <img src="/images/ico/close.svg" />
              </button>
            </div>
            <div className="flex align-middle justify-center items-center">
              <img
                src={market.tokenPair.token.icon}
                style={{ width: ICON_SIZE }}
                className="mr-3"
                alt="icon"
              />
              <div className="text-base font-normal font-nova">
                {market.tokenPair.token.symbol}
              </div>
            </div>

            {!isEnabled && (
              <div className="flex flex-col items-center mt-5 rounded-2xl">
                <div className="max-w-sm text-center my-10 mt-5 mb-5 font-normal font-nova text-white text-sm px-4">
                  To borrow or repay {market.tokenPair.token.symbol} to the
                  Tender Protocol, you need to enable it first.
                </div>
              </div>
            )}
            {isEnabled && (
              <div className="relative">
                <Max
                  maxValue={maxRepayableAmount.toString()}
                  updateValue={() => {
                    let value = math.format(maxRepayableAmount, {
                      notation: "fixed",
                    });
                    if (!inputEl || !inputEl.current) return;
                    inputEl.current.focus();
                    inputEl.current.value = value;
                    setValue(value);
                  }}
                  maxValueLabel={market.tokenPair.token.symbol}
                />
                <div className="flex flex-col justify-center items-center overflow-hidden">
                  <input
                    ref={inputEl}
                    onChange={(e) => setValue(e.target.value)}
                    style={{ minHeight: 90 }}
                    className={`w-full bg-transparent  text-white text-center outline-none ${inputTextClass}`}
                    defaultValue={0}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-grow w-full">
              <button
                className="flex-grow py-3 font-space font-bold text-xs sm:text-base uppercase"
                onClick={() => setIsRepaying(false)}
              >
                Borrow
              </button>
              <button
                className="flex-grow py-3 text-[#14F195] border-b-4 uppercase border-b-[#14F195] font-space font-bold text-xs sm:text-base"
                onClick={() => setIsRepaying(true)}
              >
                Repay
              </button>
            </div>
          </div>
          <div className="px-4 py-6 sm:px-12" style={{ background: "#0D0D0D" }}>
            <div className="flex mb-4">
              <span className="font-bold mr-3 font-nova text-xs sm:text-sm">
                Borrow Rates
              </span>
            </div>
            <div className="flex items-center mb-3 text-gray-400  pb-6">
              <img
                src={market.tokenPair.token.icon}
                style={{ width: ICON_SIZE }}
                className="mr-3"
                alt="icon"
              />
              <div className="flex-grow">Borrow APY</div>
              <div>{market.marketData.borrowApy}</div>
            </div>

            <BorrowBalance
              value={value}
              isValid={isValid}
              borrowBalance={market.totalBorrowedAmountInUsd}
              newBorrowBalance={newTotalBorrowedAmountInUsd}
              borrowLimitUsed={borrowLimitUsed}
              newBorrowLimitUsed={newBorrowLimitUsed}
            />

            <div className="flex justify-center mb-8">
              {!signer && <div>Connect wallet to get started</div>}
              {signer && !isEnabled && (
                <button
                  onClick={async () => {
                    try {
                      setIsEnabling(true);
                      // @ts-ignore existence of signer is gated above.
                      await enable(
                        signer,
                        market.tokenPair.token,
                        market.tokenPair.cToken
                      );
                      setIsEnabled(true);
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setIsEnabling(false);
                    }
                  }}
                  className={clsx(
                    "py-4 text-center text-black font-bold uppercase rounded bg-[#14F195] w-full max-w-[250px]",
                    {
                      "bg-brand-green": !isEnabling,
                      "bg-gray-200": isEnabling,
                    }
                  )}
                >
                  {isEnabling ? "Enabling..." : "Enable"}
                </button>
              )}

              {signer && isEnabled && !isValid && (
                <button className="py-4 text-center text-white font-bold rounded  w-full bg-gray-600">
                  {validationDetail}
                </button>
              )}

              {signer && isEnabled && isValid && (
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
                      let txn = await repay(
                        value,
                        signer,
                        market.tokenPair.cToken,
                        market.tokenPair.token
                      );
                      setTxnHash(txn.hash);

                      setIsWaitingToBeMined(true);
                      let tr = await txn.wait(); // TODO: error handle if transaction fails
                      setValue("");
                      updateTransaction(tr.blockHash);
                      toast.success("Repayment successful");
                      closeModal();
                    } catch (e) {
                      toast.error("Repayment unsuccessful");
                      console.error(e);
                    } finally {
                      setIsWaitingToBeMined(false);
                      setIsRepayingTxn(false);
                    }
                  }}
                  className={clsx(
                    "py-4 text-center font-bold rounded w-full text-black",
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
                {toCryptoString(walletBalance)}
                {market.tokenPair.token.symbol}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
