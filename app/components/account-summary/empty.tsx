import { useRef } from "react";
import Ring from "./ring";

const formatCurrency = (v: number): string => {
  return `$${v.toFixed(2)}`;
};

export default function AccountSummary() {
  let totalSupplyBalanceInUsd = 0;
  let totalBorrowedInUsd = 0;
  let borrowLimit = 0;
  let borrowLimitUsed = 0;

  let leftLineRef = useRef(null);
  let rightLineRef = useRef(null);

  return (
    <div className="max-w-4xl m-auto mb-24">
      <div className="flex mb-16">
        <div className="w-1/3 flex flex-col justify-center items-center">
          <div className="text-brand-green">Supply Balance</div>{" "}
          <div className="text-3xl">
            {formatCurrency(totalSupplyBalanceInUsd)}
          </div>
        </div>
        <div className="w-1/3 flex justify-center">
          <div
            style={{
              background:
                "linear-gradient(270deg, rgba(27, 214, 207, 0.4) 0%, rgba(0, 229, 175, 0.3) 100%), #111",
              boxShadow: "0 0 100px rgba(27, 214, 207, 0.5)",
            }}
            className="bg-gray-800 rounded-full w-52 h-52  justify-start relative"
          >
            <div className="flex flex-col h-full justify-center items-center">
              <div className="uppercase text-gray-100 text-sm">Net APY</div>
              <div className="text-5xl font-light">--</div>
              <div className="absolute top-0 right-0">
                <Ring percent={0} />
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/3 text-right  flex flex-col justify-center items-center">
          <div className="text-brand-blue">Borrow Balance</div>{" "}
          <div className="text-3xl">{formatCurrency(totalBorrowedInUsd)}</div>
        </div>
      </div>
      <div className="flex text-xs justify-center items-center">
        <div className=" text-gray-400 mr-2">Borrow Limit</div>
        <div
          className="bg-green-300 mr-2 h-2 rounded-full"
          style={{
            background: "linear-gradient(270deg, #1BD6CF 0%, #00E5AF 100%)",
            width: 0,
            transition: "width 1s ease-out",
          }}
          ref={leftLineRef}
        ></div>
        <div className="mr-2">{borrowLimitUsed}%</div>
        <div
          className="bg-gray-300 mr-2 h-0.5 flex-grow"
          ref={rightLineRef}
        ></div>
        <div>{formatCurrency(borrowLimit)}</div>
      </div>
    </div>
  );
}
