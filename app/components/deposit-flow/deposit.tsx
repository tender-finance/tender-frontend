import { ICON_SIZE } from "~/lib/constants";
import type { Market } from "~/types/global";
import { useContext, useEffect, useRef, useState } from "react";
import type { JsonRpcSigner } from "@ethersproject/providers";
import { useValidInput } from "~/hooks/use-valid-input";
import toast from "react-hot-toast";
import Max from "~/components/max";
import clsx from "clsx";

import { enable, deposit, hasSufficientAllowance } from "~/lib/tender";
import BorrowLimit from "../fi-modal/borrow-limit";
import { useProjectBorrowLimit } from "~/hooks/use-project-borrow-limit";
import { useBorrowLimitUsed } from "~/hooks/use-borrow-limit-used";
import ConfirmingTransaction from "../fi-modal/confirming-transition";
import { TenderContext } from "~/contexts/tender-context";

interface Props {
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
}: Props) {
  let [isWaitingToBeMined, setIsWaitingToBeMined] = useState<boolean>(false);
  let [isEnabled, setIsEnabled] = useState<boolean>(true);
  let [isEnabling, setIsEnabling] = useState<boolean>(false);
  let [isDepositing, setIsDepositing] = useState<boolean>(false);
  let [value, setValue] = useState<string>("0");
  let inputEl = useRef<HTMLInputElement>(null);
  let [isValid, validationDetails] = useValidInput(value, 0, walletBalance);

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
        <ConfirmingTransaction stopWaitingOnConfirmation={() => closeModal()} />
      )}
      {!isWaitingToBeMined && (
        <div>
          <div className="py-8 bg-brand-black-light relative">
            <div className="float-right">
              <button
                onClick={() => closeModal()}
                className="text-4xl rotate-45 text-gray-400 mr-8"
              >
                +
              </button>
            </div>
            <div className="flex align-middle justify-center items-center">
              <img
                src={market.tokenPair.token.icon}
                style={{ width: ICON_SIZE }}
                className="mr-3"
                alt="icon"
              />
              <div>Deposit {market.tokenPair.token.symbol}</div>
            </div>

            {!isEnabled && (
              <div>
                <div className="max-w-sm text-center m-auto mt-5 mb-5 text-sm text-gray-400">
                  To deposit or repay {market.tokenPair.token.symbol} to the
                  Tender Protocol, you need to enable it first.
                </div>
              </div>
            )}
            {isEnabled && (
              <div className="relative">
                <Max
                  maxValue={walletBalance.toString()}
                  updateValue={() => {
                    if (!inputEl || !inputEl.current) return;
                    inputEl.current.focus();
                    inputEl.current.value = walletBalance.toString();
                    setValue(walletBalance.toString());
                  }}
                  maxValueLabel={market.tokenPair.token.symbol}
                />
                <div className="flex flex-col justify-center items-center overflow-hidden">
                  <input
                    ref={inputEl}
                    onChange={(e) => setValue(e.target.value)}
                    className="bg-transparent text-6xl text-white text-center outline-none"
                    defaultValue={0}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sub Navigation */}
          <div className="flex mb-10">
            <button
              className="flex-grow py-3 text-brand-green border-b-2 border-b-brand-green"
              onClick={() => setIsSupplying(true)}
            >
              Deposit
            </button>
            <button
              className="flex-grow py-3"
              onClick={() => setIsSupplying(false)}
            >
              Withdraw
            </button>
          </div>
          <div className="py-6 px-12" style={{ background: "#1C1E22" }}>
            <div className="flex mb-4">
              <span className="font-bold mr-3">Deposit Rates</span>{" "}
            </div>
            <div className="flex items-center mb-3 text-gray-400  pb-6">
              <img
                src={market.tokenPair.token.icon}
                style={{ width: ICON_SIZE }}
                className="mr-3"
                alt="icon"
              />
              <div className="flex-grow">Deposit APY</div>
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
            <div className="mb-8">
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

              {signer && isEnabled && !isValid && (
                <button className="py-4 text-center text-white font-bold rounded  w-full bg-gray-200">
                  {validationDetails?.label}
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
                      setIsWaitingToBeMined(true);
                      let tr = await txn.wait();
                      setIsWaitingToBeMined(false);
                      setValue("0");
                      updateTransaction(tr.blockHash);
                      toast.success("Deposit successful");
                      closeModal();
                    } catch (e) {
                      toast.error("Deposit unsuccessful");
                      console.error(e);
                    } finally {
                      setIsDepositing(false);
                    }
                  }}
                  className={clsx(
                    "py-4 text-center text-white font-bold rounded bg-brand-green w-full",
                    {
                      "bg-brand-green": !isDepositing,
                      "bg-gray-200": isDepositing,
                    }
                  )}
                >
                  {isDepositing ? "Depositing..." : "Deposit"}
                </button>
              )}
            </div>
            <div className="flex text-gray-500">
              <div className="flex-grow">Wallet Balance</div>
              <div>
                {walletBalance} {market.tokenPair.token.symbol}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
