import { ICON_SIZE } from "~/lib/constants";
import type { Market, TokenPair } from "~/types/global";
import { useEffect, useState, useRef, useContext } from "react";
import type { JsonRpcSigner } from "@ethersproject/providers";

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
import { shrinkyInputClass, toMoneyString } from "~/lib/ui";

interface Props {
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
}: Props) {
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

  let formattedMaxBorrowLimit: string = useSafeMaxBorrowAmountForToken(
    borrowLimit,
    totalBorrowedAmountInUsd,
    market.comptrollerAddress,
    market.tokenPair
  ).toFixed(2);

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
                <div>Borrow {market.tokenPair.token.symbol}</div>
              </div>

              <div className="flex flex-col justify-center items-center overflow-hidden">
                <input
                  ref={inputEl}
                  onChange={(e) => setValue(e.target.value)}
                  style={{ minHeight: 90 }}
                  className={`w-full bg-transparent text-white text-center outline-none ${inputTextClass}`}
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
                  borrowBalance={totalBorrowedAmountInUsd}
                  newBorrowBalance={newTotalBorrowedAmountInUsd}
                  borrowLimitUsed={borrowLimitUsed}
                  newBorrowLimitUsed={newBorrowLimitUsed}
                />

                <div className="mb-8">
                  {!signer && <div>Connect wallet to get started</div>}
                  {signer && !isValid && (
                    <button className="py-4 text-center  font-bold rounded  w-full bg-gray-600 ">
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
                        "py-4 text-center  font-bold rounded w-full text-white",
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

                <div className="flex text-gray-500 mb-2">
                  <div className="flex-grow">Currently Borrowing</div>
                  <div>
                    {toMoneyString(market.borrowBalance)}{" "}
                    {market.tokenPair.token.symbol}
                  </div>
                </div>
                <div className="flex text-gray-500">
                  <div className="flex-grow">Market Liquidity</div>
                  <div>
                    {toMoneyString(market.maxBorrowLiquidity)}{" "}
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
