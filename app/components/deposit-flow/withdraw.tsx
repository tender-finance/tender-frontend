import { ICON_SIZE } from "~/lib/constants";
import type { Market } from "~/types/global";
import { useEffect, useState, useRef, useContext } from "react";
import type { JsonRpcSigner } from "@ethersproject/providers";
import toast from "react-hot-toast";
import Max from "~/components/max";
import * as math from "mathjs";
import clsx from "clsx";

import { redeem } from "~/lib/tender";
import { useValidInput } from "~/hooks/use-valid-input";
import BorrowLimit from "../fi-modal/borrow-limit";
import { useProjectBorrowLimit } from "~/hooks/use-project-borrow-limit";
import { useBorrowLimitUsed } from "~/hooks/use-borrow-limit-used";
import ConfirmingTransaction from "../fi-modal/confirming-transition";
import { TenderContext } from "~/contexts/tender-context";
import { shrinkyInputClass, toCryptoString } from "~/lib/ui";

export interface WithdrawProps {
  market: Market;
  closeModal: Function;
  setIsSupplying: Function;
  borrowLimit: number;
  signer: JsonRpcSigner | null | undefined;
  borrowLimitUsed: string;
  walletBalance: number;
  totalBorrowedAmountInUsd: number;
}
export default function Withdraw({
  market,
  closeModal,
  setIsSupplying,
  borrowLimit,
  signer,
  borrowLimitUsed,
  totalBorrowedAmountInUsd,
}: WithdrawProps) {
  let [value, setValue] = useState<string>("0");
  let [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  let [txnHash, setTxnHash] = useState<string>("");
  let inputEl = useRef<HTMLInputElement>(null);

  let { tokenPairs, updateTransaction, setIsWaitingToBeMined } =
    useContext(TenderContext);

  let newBorrowLimit = useProjectBorrowLimit(
    signer,
    market.comptrollerAddress,
    tokenPairs,
    market.tokenPair,
    `-${value}`
  );

  let newBorrowLimitUsed = useBorrowLimitUsed(
    totalBorrowedAmountInUsd,
    newBorrowLimit
  );

  var maxWithdrawAmount: number = Math.min(
    market.supplyBalance, // how much we're supplying
    market.maxBorrowLiquidity // how much cash the contract has
  );

  // // if there is a borrow balance
  // if (totalBorrowedAmountInUsd > 0) {
  //   // 0.8 * (totalSupply - totalBorrow balance / token price)
  //   // if there is a borrow or else 100%
  // }

  let [isValid, validationDetail] = useValidInput(
    value,
    0,
    maxWithdrawAmount,
    parseFloat(newBorrowLimitUsed)
  );

  let inputTextClass = shrinkyInputClass(value.length);

  // Highlights value input
  useEffect(() => {
    inputEl && inputEl.current && inputEl.current.select();
  }, []);

  return (
    <div>
      {txnHash !== "" && (
        <ConfirmingTransaction
          txnHash={txnHash}
          stopWaitingOnConfirmation={() => closeModal()}
        />
      )}
      {txnHash === "" && (
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
                className="w-12"
                alt="icon"
              />
            </div>

            <div className="flex flex-col justify-center items-center mt-6 overflow-hidden font-space">
              <input
                ref={inputEl}
                style={{ minHeight: 90 }}
                onChange={(e) => setValue(e.target.value)}
                className={`w-full text-2xl bg-transparent text-white text-center outline-none ${inputTextClass}`}
                defaultValue={0}
              />

              {parseFloat(borrowLimitUsed) < 80 && (
                <Max
                  maxValue={maxWithdrawAmount.toString()}
                  updateValue={() => {
                    if (!inputEl || !inputEl.current) return;
                    let value = math.format(maxWithdrawAmount, {
                      notation: "fixed",
                    });
                    inputEl.current.focus();
                    inputEl.current.value = value;
                    setValue(value);
                  }}
                  label="Max"
                  maxValueLabel={market.tokenPair.token.symbol}
                />
              )}
            </div>
            <div className="flex mt-6 uppercase">
              <button
                className="flex-grow py-3 font-space font-bold text-xs sm:text-base uppercase"
                onClick={() => setIsSupplying(true)}
              >
                Supply
              </button>
              <button
                className="flex-grow py-2 text-[#14F195] border-b-4 uppercase border-b-[#14F195] font-space font-bold text-xs sm:text-base"
                onClick={() => setIsSupplying(false)}
              >
                Withdraw
              </button>
            </div>
          </div>
          <div className="mt-5">
            <div className="py-6 px-4 sm:px-12 bg-[#0D0D0D]">
              <div className="flex flex-col items-center mb-3 text-gray-400  pb-6">
                <div className="flex w-full sm:w-full items-center border-b border-[#282C2B] py-8">
                  <div className="w-6 mr-3 sm:w-12">
                    <img
                      src={market.tokenPair.token.icon}
                      style={{ width: ICON_SIZE }}
                      className=""
                      alt="icon"
                    />
                  </div>
                  <div className="flex-grow text-[#ADB5B3] font-nova font-base">
                    Supply APY
                  </div>
                  <div>{market.marketData.depositApy}</div>
                </div>
                {/* <div className="flex w-full sm:w-full items-center py-8">
                  <div className="w-6 mr-3 sm:w-12">
                    <img
                      src={market.tokenPair.token.icon}
                      style={{ width: ICON_SIZE }}
                      className="mr-3"
                      alt="icon"
                    />
                  </div>
                  <div className="flex-grow text-[#ADB5B3] font-nova font-base">
                    Distribution APY
                  </div>
                  <div>{market.marketData.depositApy}</div>
                </div> */}
              </div>

              <BorrowLimit
                value={value}
                isValid={isValid}
                borrowLimit={borrowLimit}
                newBorrowLimit={newBorrowLimit}
                borrowLimitUsed={borrowLimitUsed}
                newBorrowLimitUsed={newBorrowLimitUsed}
              />

              <div className="flex justify-center mb-8">
                {!signer && <div>Connect wallet to get started</div>}
                {signer && !isValid && (
                  <button className="uppercase py-4 text-center text-black font-space font-bold text-base sm:text-lg rounded w-full bg-[#14F195] max-w-[300px]">
                    {validationDetail}
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
                        setIsWithdrawing(true);
                        // @ts-ignore existence of signer is gated above.
                        let txn = await redeem(
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
                        toast.success("Withdraw successful");
                        closeModal();
                      } catch (e) {
                        toast.error("Withdraw unsuccessful");
                        console.error(e);
                      } finally {
                        setIsWaitingToBeMined(false);
                        setIsWithdrawing(false);
                      }
                    }}
                    className={clsx(
                      "uppercase py-4 text-center text-black font-space font-bold text-base sm:text-lg rounded w-full bg-[#14F195] max-w-[300px]",
                      {
                        "bg-brand-green": !isWithdrawing,
                        "bg-gray-600": isWithdrawing,
                      }
                    )}
                  >
                    {isWithdrawing ? "Withdrawing..." : "Withdraw"}
                  </button>
                )}
              </div>

              <div className="flex mt-8">
                <div className="flex-grow text-[#ADB5B3] font-nova text-base">
                  Currently Supplying
                </div>
                <div className="font-nova text-base">
                  {toCryptoString(market.supplyBalance)}
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
