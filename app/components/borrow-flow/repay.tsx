import { ICON_SIZE } from "~/lib/constants";
import { SwapRow, SwapRowMarketDatum } from "~/types/global";
import { useEffect, useRef, useState } from "react";
import { JsonRpcSigner } from "@ethersproject/providers";

import clsx from "clsx";
import toast from "react-hot-toast";

import Max from "~/components/max";

import {
  enable,
  repay,
  hasSufficientAllowance,
  formattedValue,
} from "~/lib/tender";

import type { BigNumber } from "ethers";

interface Props {
  closeModal: Function;
  row: SwapRow;
  marketData: SwapRowMarketDatum;
  setIsRepaying: Function;
  signer: JsonRpcSigner | null | undefined;
  formattedBorrowedAmount: string;
  borrowLimitUsed: string;
  walletBalance: BigNumber;
}

export default function Repay({
  closeModal,
  row,
  marketData,
  setIsRepaying,
  signer,
  formattedBorrowedAmount,
  borrowLimitUsed,
  walletBalance,
}: Props) {
  let [isEnabled, setIsEnabled] = useState<boolean>(true);
  let [isEnabling, setIsEnabling] = useState<boolean>(false);

  let [isRepayingTxn, setIsRepayingTxn] = useState<boolean>(false);
  let [value, setValue] = useState<string>("");

  let inputEl = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!signer) {
      return;
    }
    hasSufficientAllowance(signer, row.token, row.cToken).then(
      (has: boolean) => {
        if (!has) {
          setIsEnabled(false);
        }
      }
    );
  }, [signer, row.cToken, row.token]);
  return (
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
          <div>Repay {row.name}</div>
        </div>

        {!isEnabled && (
          <div>
            <div className="max-w-sm text-center m-auto mt-5 mb-5 text-sm text-gray-400">
              To borrow or repay {row.name} to the Tender Protocol, you need to
              enable it first.
            </div>
          </div>
        )}
        {isEnabled && (
          <div className="flex flex-col justify-center items-center overflow-hidden">
            <input
              ref={inputEl}
              onChange={(e) => setValue(e.target.value)}
              className="bg-transparent text-6xl text-white text-center outline-none"
              placeholder="0"
            />
            <Max
              maxValue={formattedBorrowedAmount}
              updateValue={() => {
                if (!inputEl || !inputEl.current) return;
                inputEl.current.focus();
                inputEl.current.value = formattedBorrowedAmount;
                setValue(formattedBorrowedAmount);
              }}
              maxValueLabel={row.name}
            />
          </div>
        )}
      </div>

      <div className="flex mb-10">
        <button className="flex-grow py-3" onClick={() => setIsRepaying(false)}>
          Borrow
        </button>
        <button
          className="flex-grow py-3 text-brand-green border-b-2 border-b-brand-green"
          onClick={() => setIsRepaying(true)}
        >
          Repay
        </button>
      </div>
      <div className="py-6 px-12" style={{ background: "#1C1E22" }}>
        <div className="flex mb-4">
          <span className="font-bold mr-3">Borrow Rates</span>{" "}
          <img src="/images/box-arrow.svg" alt="box arrow" />
        </div>
        <div className="flex items-center mb-3 text-gray-400 border-b border-b-gray-600 pb-6">
          <img
            src={row.icon}
            style={{ width: ICON_SIZE }}
            className="mr-3"
            alt="icon"
          />
          <div className="flex-grow">Borrow APY</div>
          <div>{marketData.borrowApy}</div>
        </div>
        <div className="flex items-center text-gray-400 pt-4 pb-8">
          <div className="mr-3">
            <img src="/images/distribution-icon.svg" alt="Distribution icon" />
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
          {signer && !isEnabled && (
            <button
              onClick={async () => {
                try {
                  setIsEnabling(true);
                  // @ts-ignore existence of signer is gated above.
                  await enable(signer, row.token, row.cToken);
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

          {signer && isEnabled && (
            <button
              onClick={async () => {
                try {
                  if (!value) {
                    toast("Please set a value", {
                      icon: "⚠️",
                    });
                    return;
                  }

                  setIsRepayingTxn(true);
                  // @ts-ignore existence of signer is gated above.
                  await repay(value, signer, row.cToken, row.token);
                  setValue("");
                  toast.success("Repayment successful");
                  closeModal();
                } catch (e) {
                  toast.error("Repayment unsuccessful");
                  console.error(e);
                } finally {
                  setIsRepayingTxn(false);
                }
              }}
              className={clsx(
                "py-4 text-center text-white font-bold rounded bg-brand-green w-full",
                {
                  "bg-brand-green": !isRepayingTxn,
                  "bg-gray-200": isRepayingTxn,
                }
              )}
            >
              {isRepayingTxn ? "Repaying..." : "Repay"}
            </button>
          )}
        </div>

        <div className="flex text-gray-500">
          <div className="flex-grow">Wallet Balance</div>
          <div>
            {formattedValue(walletBalance, row.token.decimals)} {row.name}
          </div>
        </div>
      </div>
    </div>
  );
}
