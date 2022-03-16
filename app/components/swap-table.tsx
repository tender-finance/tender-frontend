import SwapRow from "~/components/swap-row";
import { SwapRow as SwapRowType } from "~/types/global";

export default function SwapTable() {
  const swapRows: SwapRowType[] = [
    {
      icon: "/images/coin-icons/bitcoin.svg",
      name: "Bitcoin BTC",
      marketSize: "$1.87B",
      totalBorrowed: "$1.39B",
      depositApy: "2.80%",
      depositDelta: 1.43,
      borrowApy: "3.98%",
      borrowApyDelta: 1.43,
    },
    {
      icon: "/images/coin-icons/ethereum.svg",
      name: "Ethereum ETH",
      marketSize: "$1.87B",
      totalBorrowed: "$1.39B",
      depositApy: "2.80%",
      depositDelta: -1.43,
      borrowApy: "3.98%",
      borrowApyDelta: -1.43,
    },
    {
      icon: "/images/coin-icons/tender.svg",
      name: "Tender USDT",
      marketSize: "$1.87B",
      totalBorrowed: "$1.39B",
      depositApy: "2.80%",
      depositDelta: 0,
      borrowApy: "3.98%",
      borrowApyDelta: 0,
    },
  ];
  return (
    <div className="mb-60">
      <div className="text-center flex">
        <div className="bg-brand-green text-white py-3 px-6">USD</div>
        <div className="bg-brand-black text-white opacity-50 py-3 px-6">
          Native
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl px-10 mt-8">
        {swapRows.map((row) => (
          <SwapRow key={row.icon} row={row} />
        ))}
      </div>
    </div>
  );
}
