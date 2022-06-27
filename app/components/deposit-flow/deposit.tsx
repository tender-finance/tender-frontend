import { ICON_SIZE } from "~/lib/constants";
import type { Market } from "~/types/global";
import { useContext, useEffect, useRef, useState } from "react";
import type { JsonRpcSigner } from "@ethersproject/providers";
import { useValidInput } from "~/hooks/use-valid-input";
import toast from "react-hot-toast";
import Max from "~/components/max";
import clsx from "clsx";
import * as math from "mathjs";

import { enable, deposit, hasSufficientAllowance } from "~/lib/tender";
import BorrowLimit from "../fi-modal/borrow-limit";
import { useProjectBorrowLimit } from "~/hooks/use-project-borrow-limit";
import { useBorrowLimitUsed } from "~/hooks/use-borrow-limit-used";
import ConfirmingTransaction from "../fi-modal/confirming-transition";
import { TenderContext } from "~/contexts/tender-context";
import { shrinkyInputClass, toCryptoString } from "~/lib/ui";

export interface DepositProps {
  closeModal: Function;
  market: Market;
  setIsSupplying: Function;
  borrowLimit: number;
  signer: JsonRpcSigner | null | undefined;
  borrowLimitUsed: string;
  walletBalance: number;
  totalBorrowedAmountInUsd: number;
  comptrollerAddress: string;
}
export default function Deposit({
  closeModal,
  comptrollerAddress,
  setIsSupplying,
  borrowLimit,
  signer,
  borrowLimitUsed,
  walletBalance,
  totalBorrowedAmountInUsd,
  market,
}: DepositProps) {
  let [isWaitingToBeMined, setIsWaitingToBeMined] = useState<boolean>(false);
  let [isEnabled, setIsEnabled] = useState<boolean>(true);
  let [isEnabling, setIsEnabling] = useState<boolean>(false);
  let [isDepositing, setIsDepositing] = useState<boolean>(false);
  let [value, setValue] = useState<string>("0");
  let [txnHash, setTxnHash] = useState<string>("");
  let inputTextClass = shrinkyInputClass(value.length);

  let inputEl = useRef<HTMLInputElement>(null);

  let { tokenPairs, updateTransaction } = useContext(TenderContext);

  let newBorrowLimit = useProjectBorrowLimit(
    signer,
    comptrollerAddress,
    tokenPairs,
    market.tokenPair,
    value
  );

  let newBorrowLimitUsed = useBorrowLimitUsed(
    totalBorrowedAmountInUsd,
    newBorrowLimit
  );

  let [isValid, validationDetail] = useValidInput(
    value,
    0,
    walletBalance,
    parseFloat(newBorrowLimitUsed)
  );

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
        <div className="">
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
                <img
                  src={market.tokenPair.token.icon}
                  style={{ width: ICON_SIZE }}
                  className="mr-3"
                  alt="icon"
                />
                <div className="max-w-sm text-center my-10 mt-5 mb-5 font-normal font-nova text-white text-sm">
                  To Supply or Repay {market.tokenPair.token.symbol} to the
                  Compound Protocol, you need to enable it first.
                </div>
                <div className="flex flex-grow w-full">
                  <button
                    className="flex-grow py-3 text-[#14F195] border-b-4 uppercase border-b-[#14F195] font-space font-bold text-xs sm:text-base"
                    onClick={() => setIsSupplying(true)}
                  >
                    Supply
                  </button>
                  <button
                    className="flex-grow py-3 font-space font-bold text-xs sm:text-base uppercase"
                    onClick={() => setIsSupplying(false)}
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            )}
            {isEnabled && (
              <div className="relative">
                <Max
                  maxValue={walletBalance.toString()}
                  updateValue={() => {
                    let value = math.format(walletBalance, {
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
          </div>
          {/* Sub Navigation */}
          <div className="px-4 py-6 sm:px-12" style={{ background: "#0D0D0D" }}>
            <div className="flex mb-4">
              <span className="font-bold mr-3 font-nova text-xs sm:text-sm">
                Supply Rates
              </span>
              <a>
                <img src="/images/ico/open.svg" />
              </a>
            </div>
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
                <div className="flex-grow font-nova text-sm sm:text-base text-[#ADB5B3]">
                  Supply APY
                </div>
                <div className="font-nova text-white text-xl">
                  {market.marketData.depositApy}
                </div>
              </div>
              <div className="flex w-full sm:w-full items-center py-8">
                <div className="w-6 mr-3 sm:w-12">
                  <img
                    src={market.tokenPair.token.icon}
                    style={{ width: ICON_SIZE }}
                    className=""
                    alt="icon"
                  />
                </div>

                <div className="flex-grow font-nova text-sm sm:text-base  text-[#ADB5B3]">
                  Distribution APY
                </div>
                <div className="font-nova text-white text-xl">
                  {market.marketData.depositApy}
                </div>
              </div>
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
                <button className="py-4 text-center font-bold rounded  w-full bg-gray-600">
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
                      setIsDepositing(true);
                      let txn = await deposit(
                        value,
                        signer,
                        market.tokenPair.cToken,
                        market.tokenPair.token
                      );
                      setTxnHash(txn.hash);
                      setIsWaitingToBeMined(true);
                      let tr = await txn.wait();
                      setValue("0");
                      updateTransaction(tr.blockHash);
                      toast.success("Deposit successful");
                      closeModal();
                    } catch (e) {
                      toast.error("Deposit unsuccessful");
                      console.error(e);
                    } finally {
                      setIsWaitingToBeMined(false);
                      setIsDepositing(false);
                    }
                  }}
                  className={clsx(
                    "py-4 text-center font-bold rounded w-full text-black",
                    {
                      "bg-brand-green": !isDepositing,
                      "bg-gray-600": isDepositing,
                    }
                  )}
                >
                  {isDepositing ? "Depositing..." : "Deposit"}
                </button>
              )}
            </div>
            <div className="flex mt-8">
              <div className="flex-grow text-[#ADB5B3] font-nova text-base font-normal">
                Curretly Supplying
              </div>
              <div className="text-white font-nova text-base font-normal">
                {toCryptoString(walletBalance)} {market.tokenPair.token.symbol}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
