import { ICON_SIZE } from "~/lib/constants";
import type { Market, TokenPair } from "~/types/global";
import { useEffect, useState, useRef, useContext } from "react";
import type { JsonRpcSigner } from "@ethersproject/providers";
import * as math from "mathjs";

import clsx from "clsx";
import toast from "react-hot-toast";
import Max from "~/components/max";

import { borrow } from "~/lib/tender";
import { useValidInput } from "~/hooks/use-valid-input";
import BorrowBalance from "../fi-modal/borrow-balance";
import { useBorrowLimitUsed } from "~/hooks/use-borrow-limit-used";

import ConfirmingTransaction from "../fi-modal/confirming-transition";
import { useSafeMaxBorrowAmountForToken } from "~/hooks/use-safe-max-borrow-amount-for-token";
import { TenderContext } from "~/contexts/tender-context";
import { useNewTotalBorrowedAmountInUsd } from "~/hooks/use-new-total-borrowed-amount-in-usd";
import { useMaxBorrowAmount } from "~/hooks/use-max-borrow-amount";
import { shrinkyInputClass, toCryptoString } from "~/lib/ui";

export interface BorrowProps {
  market: Market;
  closeModal: Function;
  setIsRepaying: Function;
  signer: JsonRpcSigner | null | undefined;
  borrowLimitUsed: string;
  borrowLimit: number;
  walletBalance: number;
  tokenPairs: TokenPair[];
  totalBorrowedAmountInUsd: number;
}

export default function Borrow({
  market,
  closeModal,
  setIsRepaying,
  signer,
  borrowLimit,
  borrowLimitUsed,
  totalBorrowedAmountInUsd,
}: BorrowProps) {
  let [isWaitingToBeMined, setIsWaitingToBeMined] = useState<boolean>(false);
  let [value, setValue] = useState<string>("0");
  let [isBorrowing, setIsBorrowing] = useState<boolean>(false);
  let [txnHash, setTxnHash] = useState<string>("");

  let inputEl = useRef<HTMLInputElement>(null);

  let { updateTransaction } = useContext(TenderContext);

  let newTotalBorrowedAmountInUsd = useNewTotalBorrowedAmountInUsd(
    market.tokenPair,
    totalBorrowedAmountInUsd,
    +value
  );

  let newBorrowLimitUsed = useBorrowLimitUsed(
    newTotalBorrowedAmountInUsd,
    borrowLimit
  );

  let maxBorrowLimit: number = useSafeMaxBorrowAmountForToken(
    borrowLimit,
    totalBorrowedAmountInUsd,
    market.comptrollerAddress,
    market.tokenPair,
    market.maxBorrowLiquidity
  );

  let formattedMaxBorrowLimit: string = math.format(maxBorrowLimit);

  let maxBorrowAmount = useMaxBorrowAmount(
    borrowLimit,
    totalBorrowedAmountInUsd,
    market.tokenPair
  );

  let [isValid, validationDetail] = useValidInput(
    value,
    0,
    maxBorrowAmount,
    parseFloat(newBorrowLimitUsed)
  );

  let inputTextClass = shrinkyInputClass(value.length);

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
            <div className="flex w-full align-middle justify-center items-center">
              <div className="w-9 sm:w-14">
                <img
                  src={market.tokenPair.token.icon}
                  style={{ width: ICON_SIZE }}
                  className="mr-3"
                  alt="icon"
                />
              </div>
              <div>Borrow {market.tokenPair.token.symbol}</div>
            </div>

            <div className="flex flex-col justify-center items-center mt-6 overflow-hidden font-space">
              <input
                ref={inputEl}
                onChange={(e) => setValue(e.target.value)}
                style={{ minHeight: 90 }}
                className={`w-full text-2xl bg-transparent text-white text-center outline-none ${inputTextClass}`}
                defaultValue={0}
              />

              {parseFloat(borrowLimitUsed) < 80 && (
                <Max
                  maxValue={`${formattedMaxBorrowLimit}`}
                  updateValue={() => {
                    if (!inputEl || !inputEl.current) return;
                    inputEl.current.focus();
                    inputEl.current.value = `${formattedMaxBorrowLimit}`;
                    setValue(`${formattedMaxBorrowLimit}`);
                  }}
                  maxValueLabel={market.tokenPair.token.symbol}
                  label="80% Max"
                />
              )}
            </div>

            <div className="flex mt-6 uppercase">
              <button
                className="flex-grow py-2 text-[#14F195] border-b-4 uppercase border-b-[#14F195] font-space font-bold text-xs sm:text-base"
                onClick={() => setIsRepaying(false)}
              >
                Borrow
              </button>
              <button
                className="flex-grow py-2 font-space font-bold text-xs sm:text-base uppercase"
                onClick={() => setIsRepaying(true)}
              >
                Repay
              </button>
            </div>
          </div>
          <div className="mt-5">
            <div className="px-4 sm:px-12 bg-[#0D0D0D]">
              <div className="flex mb-2 justify-end items-center">
                <span className="font-bold text-xs sm:text-sm mr-3">
                  Borrow Rates
                </span>
              </div>
              <div className="flex items-center mb-2 pb-4 border-b border-[#282C2B]">
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
                borrowBalance={totalBorrowedAmountInUsd}
                newBorrowBalance={newTotalBorrowedAmountInUsd}
                borrowLimitUsed={borrowLimitUsed}
                newBorrowLimitUsed={newBorrowLimitUsed}
              />

              <div className="flex justify-center mb-3.5 sm:mb-6">
                {!signer && <div>Connect wallet to get started</div>}
                {signer && !isValid && (
                  <button className="uppercase py-4 text-center text-black font-space font-bold text-base sm:text-lg rounded w-full bg-[#14F195] max-w-[250px]">
                    {validationDetail || "Borrow"}
                  </button>
                )}
                {signer && isValid && (
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

                        let txn = await borrow(
                          value,
                          signer,
                          market.tokenPair.cToken,
                          market.tokenPair.token
                        );

                        setTxnHash(txn.hash);
                        setIsWaitingToBeMined(true);
                        let tr = await txn.wait(); // TODO: error handle if transaction fails
                        updateTransaction(tr.blockHash);
                        toast.success("Borrow successful");
                        closeModal();
                      } catch (e) {
                        toast.error("Borrow unsuccessful");
                        console.error(e);
                      } finally {
                        setIsWaitingToBeMined(false);
                        setIsBorrowing(false);
                      }
                    }}
                    className={clsx(
                      "py-4 text-center text-white font-bold rounded w-full",
                      {
                        "bg-brand-green ": !isBorrowing,
                        "bg-gray-600": isBorrowing,
                      }
                    )}
                  >
                    {isBorrowing ? "Borrowing..." : "Borrow"}
                  </button>
                )}
              </div>

              <div className="flex mb-5 sm:mb-8">
                <div className="flex-grow text-[#ADB5B3] font-nova text-base">
                  Currently Borrowing
                </div>
                <div>
                  {toCryptoString(market.borrowBalance)}
                  {market.tokenPair.token.symbol}
                </div>
              </div>
              <div className="flex mb-5 sm:mb-8">
                <div className="flex-grow text-[#ADB5B3] font-nova text-base">
                  Market Liquidity
                </div>
                <div>
                  {toCryptoString(market.maxBorrowLiquidity)}
                  {market.tokenPair.token.symbol}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
