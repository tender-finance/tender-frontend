import { ICON_SIZE } from "~/lib/constants";
import type { SwapRow, SwapRowMarketDatum } from "~/types/global";
import { useEffect, useState, useRef } from "react";
import type { JsonRpcSigner } from "@ethersproject/providers";
import toast from "react-hot-toast";
import Max from "~/components/max";

import clsx from "clsx";

import { redeem, getCurrentlySupplying } from "~/lib/tender";

interface Props {
  closeModal: Function;
  row: SwapRow;
  marketData: SwapRowMarketDatum;
  setIsSupplying: Function;
  borrowLimit: number;
  signer: JsonRpcSigner | null | undefined;
  borrowLimitUsed: string;
  walletBalance: string;
}
export default function Withdraw({
  closeModal,
  row,
  marketData,
  setIsSupplying,
  borrowLimit,
  signer,
  borrowLimitUsed,
}: Props) {
  let [value, setValue] = useState<string>("");
  let [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
  let [currentlySupplying, setCurrentlySupplying] = useState<string>("0");
  let inputEl = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!signer) {
      return;
    }
    getCurrentlySupplying(signer, row.cToken, row.token).then((c) =>
      setCurrentlySupplying(c)
    );
  }, [signer, row.cToken, row.token]);

  return (
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
            <div>Withdraw {row.name}</div>
          </div>

          <div className="flex flex-col justify-center items-center overflow-hidden">
            <input
              ref={inputEl}
              onChange={(e) => setValue(e.target.value)}
              className="bg-transparent text-6xl text-white text-center outline-none"
              placeholder="0"
            />
            <Max
              maxValue={currentlySupplying}
              updateValue={() => {
                if (!inputEl || !inputEl.current) return;
                inputEl.current.focus();
                inputEl.current.value = currentlySupplying;
                setValue(currentlySupplying);
              }}
              maxValueLabel={row.name}
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
              <img src="/images/box-arrow.svg" alt="box arrow" />
            </div>
            <div className="flex items-center mb-3 text-gray-400 border-b border-b-gray-600 pb-6">
              <img
                src={row.icon}
                style={{ width: ICON_SIZE }}
                className="mr-3"
                alt="icon"
              />
              <div className="flex-grow">Deposit APY</div>
              <div>{marketData.depositApy}</div>
            </div>
            <div className="flex items-center text-gray-400 pt-4 pb-8">
              <div className="mr-3">
                <img
                  src="/images/distribution-icon.svg"
                  alt="Distribution APY Icon"
                />
              </div>
              <div className="flex-grow">Distribution APY</div>
              <div>0%</div>
            </div>

            <div>
              <div className="font-bold mr-3 border-b border-b-gray-600 w-full pb-5">
                Borrow Limit
              </div>
              <div className="flex items-center mb-3 text-gray-400 border-b border-b-gray-600 py-5">
                <div className="flex-grow">Borrow Limit </div>
                <div>
                  $0 <span className="text-brand-green">→</span> ${borrowLimit}
                </div>
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
                      setIsWithdrawing(true);
                      // @ts-ignore existence of signer is gated above.
                      await redeem(value, signer, row.cToken, row.token);

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
                {currentlySupplying} {row.name}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
