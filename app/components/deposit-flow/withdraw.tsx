import { ICON_SIZE } from "~/lib/constants";
import type { Market } from "~/types/global";
import { useEffect, useState, useRef, useContext } from "react";
import type { JsonRpcSigner } from "@ethersproject/providers";
import toast from "react-hot-toast";
import Max from "~/components/max";
import * as math from "mathjs"
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
  let [isWaitingToBeMined, setIsWaitingToBeMined] = useState<boolean>(false);
  let [value, setValue] = useState<string>("0");
  let [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  let [txnHash, setTxnHash] = useState<string>("");
  let inputEl = useRef<HTMLInputElement>(null);

  let { tokenPairs, updateTransaction } = useContext(TenderContext);

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
    market.maxBorrowLiquidity, // how much cash the contract has
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
      {isWaitingToBeMined && (
        <ConfirmingTransaction
          txnHash={txnHash}
          stopWaitingOnConfirmation={() => closeModal()}
        />
      )}
      {!isWaitingToBeMined && (
        <div>
          <div>
            <div className="pt-8 bg-[#151515] relative border-[#B5CFCC2B] border-b">
              <div className="float-right">
                <button
                  onClick={() => closeModal()}
                  className="mr-8"
                >
                  <img src="/images/ico/close.svg"/>
                </button>
              </div>
              <div className="flex w-full align-middle justify-center items-center">
                <img
                  src={market.tokenPair.token.icon}
                  style={{ width: ICON_SIZE }}
                  className=""
                  alt="icon"
                />
              </div>

              <div className="flex flex-col justify-center items-center mt-6 overflow-hidden font-space">
                <input
                  ref={inputEl}
                  style={{ minHeight: 90 }}
                  onChange={(e) => setValue(e.target.value)}
                  className={`w-full bg-transparent text-white text-center outline-none ${inputTextClass}`}
                  defaultValue={0}
                />

                {parseFloat(borrowLimitUsed) < 80 && (
                  <Max
                    maxValue={maxWithdrawAmount.toString()}
                    updateValue={() => {
                      if (!inputEl || !inputEl.current) return;
                      let value = math.format(maxWithdrawAmount, {notation: "fixed"})
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
                className="flex-grow py-2 font-space font-bold text-base uppercase"
                onClick={() => setIsSupplying(true)}
              >
                Supply
              </button>
              <button
                className="flex-grow py-2 text-[#14F195] border-b-4 uppercase border-b-[#14F195] font-space font-bold text-base"
                onClick={() => setIsSupplying(false)}
              >
                Withdraw
              </button>
            </div>
            </div>
            <div className=" pt-6">
              <div className="px-12 bg-[#0D0D0D]">
                <div className="flex mb-2 justify-end items-center">
                  <span className="font-bold mr-3">Supply Rates</span>{" "}
                  <a><img src="/images/ico/open.svg"/></a>
                </div>
                <div className="flex items-center mb-2  pb-4 border-b border-[#282C2B]">
                  <img
                    src={market.tokenPair.token.icon}
                    style={{ width: ICON_SIZE }}
                    className="mr-3"
                    alt="icon"
                  />
                  <div className="flex-grow text-[#ADB5B3] font-nova font-base">Supply APY</div>
                  <div>{market.marketData.depositApy}</div>
                </div>
                <div className="flex items-center mb-2 pb-4">
                  <img
                    src={market.tokenPair.token.icon}
                    style={{ width: ICON_SIZE }}
                    className="mr-3"
                    alt="icon"
                  />
                  <div className="flex-grow text-[#ADB5B3] font-nova font-base">Distribution APY</div>
                  <div>{market.marketData.depositApy}</div>
                </div>

                <BorrowLimit
                  value={value}
                  isValid={isValid}
                  borrowLimit={borrowLimit}
                  newBorrowLimit={newBorrowLimit}
                  borrowLimitUsed={borrowLimitUsed}
                  newBorrowLimitUsed={newBorrowLimitUsed}
                />

                <div className="mb-6">
                  {!signer && <div>Connect wallet to get started</div>}
                  {signer && !isValid && (
                    <button className="uppercase py-4 text-center text-black font-space font-bold text-lg rounded w-full bg-[#14F195]">
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
                        "py-4 text-center text-white font-bold rounded w-full",
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

                <div className="flex text-gray-500">
                  <div className="flex-grow text-[#ADB5B3] font-nova text-base">Currently Supplying</div>
                  <div className="font-nova text-bas text-white">
                    {toCryptoString(market.supplyBalance)}{" "}
                    {market.tokenPair.token.symbol}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
