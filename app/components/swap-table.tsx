import SwapRow from "~/components/swap-row";
import { SwapRow as SwapRowType } from "~/types/global";
import { useState } from "react";
import clsx from "clsx";

export default function SwapTable() {
  let [showUsd, setShowUsd] = useState<boolean>(true);
  const swapRows: SwapRowType[] = [
    {
      icon: "/images/coin-icons/bitcoin.svg",
      name: "Bitcoin BTC",
      marketSizeUsd: "$1.87B",
      marketSizeNative: "3ETH",
      totalBorrowedUsd: "$1.39B",
      totalBorrowedNative: "3ETH",
      depositApy: "2.80%",
      depositDelta: 1.43,
      borrowApy: "3.98%",
      borrowApyDelta: 1.43,
    },
    {
      icon: "/images/coin-icons/ethereum.svg",
      name: "Ethereum ETH",
      marketSizeUsd: "$1.87B",
      marketSizeNative: "3ETH",
      totalBorrowedUsd: "$1.39B",
      totalBorrowedNative: "3ETH",
      depositApy: "2.80%",
      depositDelta: -1.43,
      borrowApy: "3.98%",
      borrowApyDelta: -1.43,
    },
    {
      icon: "/images/coin-icons/tender.svg",
      name: "Tender USDT",
      marketSizeUsd: "$1.87B",
      marketSizeNative: "3ETH",
      totalBorrowedUsd: "$1.39B",
      totalBorrowedNative: "3ETH",
      depositApy: "2.80%",
      depositDelta: 0,
      borrowApy: "3.98%",
      borrowApyDelta: 0,
    },
  ];
  return (
    <div className="mb-60">
      <div className="text-center flex">
        <div
          onClick={() => setShowUsd(true)}
          className={clsx("cursor-pointer  text-white py-3 px-6", {
            "bg-brand-green": showUsd,
            "bg-brand-black opacity-50": !showUsd,
          })}
        >
          USD
        </div>
        <div
          onClick={() => setShowUsd(false)}
          className={clsx("cursor-pointer  text-white  py-3 px-6", {
            "bg-brand-green": !showUsd,
            "bg-brand-black opacity-50": showUsd,
          })}
        >
          Native
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl px-10 mt-8">
        {swapRows.map((row) => (
          <SwapRow showUsd={showUsd} key={row.icon} row={row} />
        ))}
      </div>
    </div>
  );
}
