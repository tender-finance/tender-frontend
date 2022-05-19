import { ICON_SIZE } from "~/lib/constants";
import type { Market } from "~/types/global";
import { useEffect, useState, useRef, useContext } from "react";
import type { JsonRpcSigner } from "@ethersproject/providers";
import toast from "react-hot-toast";
import Max from "~/components/max";

import clsx from "clsx";

import { redeem } from "~/lib/tender";
import { useValidInput } from "~/hooks/use-valid-input";
import BorrowLimit from "../fi-modal/borrow-limit";
import { useProjectBorrowLimit } from "~/hooks/use-project-borrow-limit";
import { useBorrowLimitUsed } from "~/hooks/use-borrow-limit-used";
import { useSafeMaxWithdrawAmountForToken } from "~/hooks/use-safe-max-withdraw-amount-for-token";
import ConfirmingTransaction from "../fi-modal/confirming-transition";
import { TenderContext } from "~/contexts/tender-context";

interface Props {
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
}: Props) {
  let [isWaitingToBeMined, setBlockChaining] = useState<boolean>(false);
  let [value, setValue] = useState<string>("0");
  let [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
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

  let formattedSafeMaxWithdrawAmount: string = useSafeMaxWithdrawAmountForToken(
    signer,
    market.supplyBalance,
    totalBorrowedAmountInUsd,
    market.comptrollerAddress,
    tokenPairs,
    market.tokenPair
  ).toFixed(2);

  let [isValid, validationDetails] = useValidInput(
    value,
    0,
    parseFloat(formattedSafeMaxWithdrawAmount)
  );

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
          <div>
            <div className="py-8 bg-brand-black-light">
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
                <div>Withdraw {market.tokenPair.token.symbol}</div>
              </div>

              <div className="flex flex-col justify-center items-center overflow-hidden">
                <input
                  ref={inputEl}
                  onChange={(e) => setValue(e.target.value)}
                  className="bg-transparent text-6xl text-white text-center outline-none"
                  defaultValue={0}
                />
                <Max
                  maxValue={`${parseFloat(formattedSafeMaxWithdrawAmount)}`}
                  updateValue={() => {
                    if (!inputEl || !inputEl.current) return;
                    inputEl.current.focus();
                    inputEl.current.value = formattedSafeMaxWithdrawAmount;
                    setValue(formattedSafeMaxWithdrawAmount);
                  }}
                  label="80% Max"
                  maxValueLabel={market.tokenPair.token.symbol}
                />
              </div>
            </div>
            <div className="flex">
              <button
                className="flex-grow py-3"
                onClick={() => setIsSupplying(true)}
              >
                Deposit
              </button>
              <button
                className="flex-grow py-3 text-brand-green border-b-2 border-b-brand-green"
                onClick={() => setIsSupplying(false)}
              >
                Withdraw
              </button>
            </div>
            <div className="py-8" style={{ background: "#1C1E22" }}>
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
                  {signer && !isValid && (
                    <button className="py-4 text-center text-white font-bold rounded w-full bg-gray-200">
                      {validationDetails?.label}
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

                          setBlockChaining(true);
                          let tr = await txn.wait(); // TODO: error handle if transaction fails
                          setBlockChaining(false);
                          setValue("");
                          updateTransaction(tr);
                          toast.success("Withdraw successful");
                          closeModal();
                        } catch (e) {
                          console.error(e);
                        } finally {
                          setIsWithdrawing(false);
                        }
                      }}
                      className={clsx(
                        "py-4 text-center text-white font-bold rounded bg-brand-green w-full",
                        {
                          "bg-brand-green": !isWithdrawing,
                          "bg-gray-200": isWithdrawing,
                        }
                      )}
                    >
                      {isWithdrawing ? "Withdrawing..." : "Withdraw"}
                    </button>
                  )}
                </div>

                <div className="flex text-gray-500">
                  <div className="flex-grow">Currently Supplying</div>
                  <div>
                    {market.supplyBalance} {market.tokenPair.token.symbol}
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
