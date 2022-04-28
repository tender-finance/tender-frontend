import { ICON_SIZE } from "~/lib/constants";
import type { SwapRow, SwapRowMarketDatum, TokenPair } from "~/types/global";
import { useEffect, useState, useRef } from "react";
import type { JsonRpcSigner } from "@ethersproject/providers";

import clsx from "clsx";
import toast from "react-hot-toast";
import Max from "~/components/max";

import { borrow } from "~/lib/tender";
import { useValidInput } from "~/hooks/use-valid-input";
import BorrowBalance from "../fi-modal/borrow-balance";
import { useProjectBorrowLimit } from "~/hooks/use-project-borrow-limit";
import { useBorrowLimitUsed } from "~/hooks/use-borrow-limit-used";
import { useCurrentlyBorrowing } from "~/hooks/use-currently-borrowing";

import ConfirmingTransaction from "../fi-modal/confirming-transition";

interface Props {
  closeModal: Function;
  row: SwapRow;
  marketData: SwapRowMarketDatum;
  setIsRepaying: Function;
  signer: JsonRpcSigner | null | undefined;
  borrowLimitUsed: string;
  borrowLimit: number;
  walletBalance: number;
  tokenPairs: TokenPair[];
  totalBorrowedAmount: number;
}

export default function Borrow({
  closeModal,
  row,
  marketData,
  setIsRepaying,
  signer,
  borrowLimit,
  borrowLimitUsed,
  tokenPairs,
  totalBorrowedAmount,
}: Props) {
  let [isWaitingToBeMined, setIsWaitingToBeMined] = useState<boolean>(false);
  let [value, setValue] = useState<string>("");
  let [isBorrowing, setIsBorrowing] = useState<boolean>(false);
  let inputEl = useRef<HTMLInputElement>(null);
  let currentlyBorrowing = useCurrentlyBorrowing(signer, row.cToken, row.token);
  let isValid = useValidInput(value, 0, borrowLimit);

  let newBorrowLimit = useProjectBorrowLimit(
    signer,
    row.comptrollerAddress,
    tokenPairs,
    row.cToken,
    `-${value}`
  );

  let newBorrowLimitUsed = useBorrowLimitUsed(
    totalBorrowedAmount,
    newBorrowLimit
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
                  src={row.icon}
                  style={{ width: ICON_SIZE }}
                  className="mr-3"
                  alt="icon"
                />
                <div>Borrow {row.name}</div>
              </div>

              <div className="flex flex-col justify-center items-center overflow-hidden">
                <input
                  ref={inputEl}
                  onChange={(e) => setValue(e.target.value)}
                  className="bg-transparent text-6xl text-white text-center outline-none"
                  defaultValue={0}
                />

                <Max
                  maxValue={`${borrowLimit}`}
                  updateValue={() => {
                    if (!inputEl || !inputEl.current) return;
                    inputEl.current.focus();
                    inputEl.current.value = `${borrowLimit}`;
                    setValue(`${borrowLimit}`);
                  }}
                  maxValueLabel={row.name}
                />
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
                <div className="flex items-center mb-3 text-gray-400  pb-6">
                  <img
                    src={row.icon}
                    style={{ width: ICON_SIZE }}
                    className="mr-3"
                    alt="icon"
                  />
                  <div className="flex-grow">Borrow APY</div>
                  <div>{marketData.borrowApy}</div>
                </div>

                <BorrowBalance
                  value={value}
                  isValid={isValid}
                  borrowBalance={currentlyBorrowing}
                  newBorrowBalance={currentlyBorrowing + +value}
                  borrowLimitUsed={borrowLimitUsed}
                  newBorrowLimitUsed={newBorrowLimitUsed}
                />

                <div className="mb-8">
                  {!signer && <div>Connect wallet to get started</div>}
                  {signer && !isValid && (
                    <button className="py-4 text-center text-white font-bold rounded bg-brand-green w-full bg-gray-200">
                      Borrow
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
                            row.cToken,
                            row.token
                          );

                          setIsWaitingToBeMined(true);
                          await txn.wait(); // TODO: error handle if transaction fails
                          setIsWaitingToBeMined(false);
                          //   setValue("");
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
      )}
    </div>
  );
}
