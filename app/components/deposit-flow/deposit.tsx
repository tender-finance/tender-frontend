import { ICON_SIZE } from "~/lib/constants";
import { SwapRow, SwapRowMarketDatum } from "~/types/global";
import { useEffect, useRef, useState } from "react";
import { JsonRpcSigner } from "@ethersproject/providers";
import toast from "react-hot-toast";
import Max from "~/components/max";

import clsx from "clsx";

import {
  enable,
  deposit,
  hasSufficientAllowance,
  formattedValue,
} from "~/lib/tender";
import { BigNumber } from "ethers";

interface Props {
  closeModal: Function;
  row: SwapRow;
  marketData: SwapRowMarketDatum;
  setIsSupplying: Function;
  borrowLimit: number;
  signer: JsonRpcSigner | null | undefined;
  borrowLimitUsed: string;
  walletBalance: BigNumber;
}
export default function Deposit({
  closeModal,
  row,
  marketData,
  setIsSupplying,
  borrowLimit,
  signer,
  borrowLimitUsed,
  walletBalance,
}: Props) {
  let [isEnabled, setIsEnabled] = useState<boolean>(true);
  let [isEnabling, setIsEnabling] = useState<boolean>(false);
  let [isDepositing, setIsDepositing] = useState<boolean>(false);
  let [value, setValue] = useState<string>("");
  let inputEl = useRef<HTMLInputElement>(null);

  let formattedWalletBalance: string = formattedValue(
    walletBalance,
    row.token.decimals
  );

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
            src={row.icon}
            style={{ width: ICON_SIZE }}
            className="mr-3"
            alt="icon"
          />
          <div>Deposit {row.name}</div>
        </div>

        {!isEnabled && (
          <div>
            <div className="max-w-sm text-center m-auto mt-5 mb-5 text-sm text-gray-400">
              To deposit or repay {row.name} to the Tender Protocol, you need to
              enable it first.
            </div>
          </div>
        )}
        {isEnabled && (
          <div className="relative">
            <Max
              maxValue={formattedWalletBalance}
              updateValue={() => {
                if (!inputEl || !inputEl.current) return;
                inputEl.current.focus();
                inputEl.current.value = formattedWalletBalance;
                setValue(formattedWalletBalance);
              }}
              maxValueLabel={row.name}
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
                  setIsDepositing(true);
                  // @ts-ignore existence of signer is gated above.
                  await deposit(value, signer, row.cToken, row.token);
                  setValue("");
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
            {formattedWalletBalance} {row.name}
          </div>
        </div>
      </div>
    </div>
  );
}
