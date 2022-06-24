import { toFiatString } from "~/lib/ui";
import Ring from "./ring";
interface props {
  totalSupplyBalanceInUsd: number;
  totalBorrowedInUsd: number;
  netApy: number | null;
  borrowLimitUsed: string;
  percentUsed: number;
  borrowLimit: number;
}

export default function Display({
  totalBorrowedInUsd,
  totalSupplyBalanceInUsd,
  netApy,
  borrowLimitUsed,
  percentUsed,
  borrowLimit,
}: props) {
  return (
    <div
      className="mb-24 border-custom px-4 relative"
      style={{
        borderRadius: "1rem 1rem 0 0",
        background: `linear-gradient(
      
      #111111 0%,
      rgba(0, 34, 29, .7) 100%
    )`,
      }}
    >
      <div
        className="testCircle"
        style={{
          top: "-50%",
          left: `calc(50% - 103px)`,
          background:
            "linear-gradient(135deg, rgba(10, 10, 10, 0.12) 0%, rgba(20, 242, 185, .3) 100%), #111",
        }}
      >
        <div className="flex flex-col h-full justify-center items-center">
          <div className="uppercase text-[#818987] font-nova font-medium text-sm">
            Net APY
          </div>

          {netApy != null && (
            <div className="text-4xl font-space font-normal">
              {netApy.toFixed(2)}%
            </div>
          )}
          <div className="absolute top-0 right-0"></div>
          <div className="absolute top-0 right-0"></div>
          {netApy == null && (
            <div className="text-4xl font-space font-normal">--</div>
          )}
          <div
            className="absolute top-0 right-0"
            style={{ top: "22px", right: "103px" }}
          >
            {netApy != null &&
              totalSupplyBalanceInUsd /
                (totalBorrowedInUsd + totalSupplyBalanceInUsd) >
                0 && (
                <Ring
                  percent={
                    totalSupplyBalanceInUsd /
                    (totalBorrowedInUsd + totalSupplyBalanceInUsd)
                  }
                />
              )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center mt-16 justify-between my-16 md:flex">
        <div className="w-1/3 flex flex-col justify-center items-center">
          <div className="text-dark-green font-nova font-semibold text-sm mb-4">
            Supply Balance
          </div>{" "}
          <div className="text-3xl font-space mb-10">
            {toFiatString(totalSupplyBalanceInUsd)}
          </div>
        </div>
        <div className="w-1/3 text-right  flex flex-col justify-center items-center">
          <div className="mb-4 text-dark-green text-sm font-nova font-semibold">
            Borrow Balance
          </div>{" "}
          <div className="text-3xl font-space">
            {toFiatString(totalBorrowedInUsd)}
          </div>
        </div>
      </div>
      <div className="flex flex-col text-xs justify-center font-nova">
        <div className="justify-self-start text-xs text-[#818987] pb-1 font-nova font-normal">
          Borrow Limit
        </div>
        <div
          className="bg-green-300 mr-2 h-2 rounded-full"
          style={{
            background:
              percentUsed > 79
                ? "linear-gradient(270deg, rgba(255, 0, 0.5) 0%, rgba(255, 0, 0, 1) 100%)"
                : "linear-gradient(270deg, #1BD6CF 0%, #00E5AF 100%)",
            width: borrowLimitUsed === "" ? 0 : `${percentUsed}%`,
            transition: "width 1s ease-out",
          }}
        ></div>
        <div className="flex justify-start items-center">
          <div className="pb-2.5 font-nova text-sm text-white">
            {toFiatString(borrowLimit)}
          </div>
          <div className="mr-2 pb-2.5 font-nova text-sm text-white">
            {borrowLimitUsed}%
          </div>
        </div>
      </div>
      <div className="w-full flex absolute bottom-0 left-0">
        <div className="bg-[#262D2A] h-1 flex-grow"></div>
      </div>
    </div>
  );
}
