import type { SwapRow } from "~/types/global";
interface Props {
  row: SwapRow;
}
export default function SwapRow({ row }: Props) {
  return (
    <div className="py-6 flex align-middle items-center border-b border-b-gray-700 font-light text-gray-300">
      <div className="flex items-center align-middle">
        <div className="mr-4">
          <img src={row.icon} />
        </div>
        <div style={{ width: "250px" }}>{row.name}</div>
      </div>
      <div className="grid grid-cols-4 flex-grow">
        <div>{row.marketSize}</div>
        <div>{row.totalBorrowed}</div>
        <div>{row.depositApy}</div>
        <div>{row.borrowApy}</div>
      </div>
      <div>
        <button className="border rounded py-3 px-8 mr-3">Deposit</button>
        <button className="border border-transparent text-white rounded py-3 px-8 bg-brand-green">
          Borrow
        </button>
      </div>
    </div>
  );
}
