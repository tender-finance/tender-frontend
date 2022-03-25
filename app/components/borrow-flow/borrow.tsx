import { SwapRow, SwapRowMarketDatum } from "~/types/global";
import { useEffect, useState } from "react";
import { JsonRpcSigner } from "@ethersproject/providers";

import clsx from "clsx";
import toast from "react-hot-toast";

import { getCurrentlyBorrowing, borrow } from "~/lib/tender";

interface Props {
  closeModal: Function;
  row: SwapRow;
  marketData: SwapRowMarketDatum;
  setIsRepaying: Function;
  signer: JsonRpcSigner | null;
  formattedBorrowedAmount: string;
  borrowLimitUsed: number;
  walletBalance: string;
}

export default function Borrow({
  closeModal,
  row,
  marketData,
  setIsRepaying,
  signer,
  formattedBorrowedAmount,
  borrowLimitUsed,
}: Props) {
  let [value, setValue] = useState<string>("");
  let [currentlyBorrowing, setCurrentlyBorrowing] = useState<string>("0");
  let [isBorrowing, setIsBorrowing] = useState<boolean>(false);

  useEffect(() => {
    if (!signer) {
      return;
    }
    getCurrentlyBorrowing(signer, row.cToken).then((c) =>
      setCurrentlyBorrowing(c)
    );
  }, [signer, row.cToken]);

  return (
    <div>
      <div>
        <div className="py-8" style={{ backgroundColor: "#23262B" }}>
          <div className="float-right">
            <button
              onClick={() => closeModal()}
              className="text-4xl rotate-45 text-gray-400 mr-8"
            >
              +
            </button>
          </div>
          <div className="flex align-middle justify-center items-center">
            <div className="mr-4">
              <img src={row.icon} />
            </div>
            <div>Deposit {row.name}</div>
          </div>

          <div className="flex flex-col justify-center items-center overflow-hidden">
            <input
              onChange={(e) => setValue(e.target.value)}
              className="bg-transparent text-6xl text-white text-center outline-none"
              placeholder="0"
            />
            <div className="text-gray-400 text-sm m-auto">Max ⬆</div>
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
            <div className="flex items-center mb-3 text-gray-400 border-b border-b-gray-600 pb-6">
              <div className="mr-3">
                <img src="/images/supply-icon.svg" />
              </div>
              <div className="flex-grow">Borrow APY</div>
              <div>{marketData.borrowApy}</div>
            </div>
            <div className="flex items-center text-gray-400 pt-4 pb-8">
              <div className="mr-3">
                <img src="/images/distribution-icon.svg" />
              </div>
              <div className="flex-grow">Distribution APY</div>
              <div>0%</div>
            </div>
            <div>
              <div className="font-bold mr-3 border-b border-b-gray-600 w-full pb-5">
                Borrow Limit
              </div>
              <div className="flex items-center mb-3 text-gray-400 border-b border-b-gray-600 py-5">
                <div className="flex-grow">Borrow Balance</div>
                <div>${formattedBorrowedAmount}</div>
              </div>
              <div className="flex items-center mb-3 text-gray-400 border-b border-b-gray-600 py-5">
                <div className="flex-grow">Borrow Limit Used</div>
                <div>
                  0 <span className="text-brand-green">→</span>&nbsp;
                  {borrowLimitUsed}%
                </div>
              </div>
            </div>

            <div className="mb-8">
              {!signer && <div>Connect wallet to get started</div>}
              {signer && (
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
                      // @ts-ignore existence of signer is gated above.
                      await borrow(value, signer, row.cToken);
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
  );
}
