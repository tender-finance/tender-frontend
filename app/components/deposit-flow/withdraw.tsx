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
  totalBorrowedAmount: number;
}
export default function Withdraw({
  market,
  closeModal,
  setIsSupplying,
  borrowLimit,
  signer,
  borrowLimitUsed,
  totalBorrowedAmount,
}: Props) {
  let [isWaitingToBeMined, setBlockChaining] = useState<boolean>(false);
  let [value, setValue] = useState<string>("");
  let [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  let inputEl = useRef<HTMLInputElement>(null);
  let isValid = useValidInput(value, 0, market.supplyBalance);

  let { tokenPairs } = useContext(TenderContext);

  let newBorrowLimit = useProjectBorrowLimit(
    signer,
    market.comptrollerAddress,
    tokenPairs,
    market.tokenPair.cToken,
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
                  src={market.tokenMetaData.icon}
                  style={{ width: ICON_SIZE }}
                  className="mr-3"
                  alt="icon"
                />
                <div>Withdraw {market.tokenMetaData.name}</div>
              </div>

              <div className="flex flex-col justify-center items-center overflow-hidden">
                <input
                  ref={inputEl}
                  onChange={(e) => setValue(e.target.value)}
                  className="bg-transparent text-6xl text-white text-center outline-none"
                  defaultValue={0}
                />
                <Max
                  maxValue={market.supplyBalance.toString()}
                  updateValue={() => {
                    if (!inputEl || !inputEl.current) return;
                    inputEl.current.focus();
                    inputEl.current.value = market.supplyBalance.toString();
                    setValue(market.supplyBalance.toString());
                  }}
                  maxValueLabel={market.tokenMetaData.name}
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
                    src={market.tokenMetaData.icon}
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
                      Withdraw
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
                          await txn.wait(); // TODO: error handle if transaction fails
                          setBlockChaining(false);
                          setValue("");
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
                    {market.supplyBalance} {market.tokenMetaData.name}
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
