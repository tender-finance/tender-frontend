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
    <div className="mb-[90px] md:mb-20 border-custom px-4 relative top__custom">
      <div className="absolute w-[130px] h-[130px] top-[-64px] left-[50%] translate-x-[-50%] rounded-full md:w-[200px] md:h-[200px] md:top-[-80px] md:top-[-67px] top__custom__value">
        <div className="flex flex-col h-full justify-center items-center">
          <div className="uppercase text-[#818987] text-[13px] leading-[170%] tracking-widest font-nova font-medium text-sm transform-custom">
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
            <div className="text-2xl md:text-4xl font-space font-normal">
              --
            </div>
          )}
          <div className="absolute top-[50%] left-[50%] translate__50 items-center flex justify-center">
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
      <div className="flex flex-col items-center mt-16 pt-[85px] md:flex-row justify-between my-6 mb-[42px] md:mb-[25px] md:pt-[56px] md:my-6">
        <div className="w-full md:max-w-[491px] flex flex-col justify-center items-center mb-[34px] md:mb-0">
          <div className="text-dark-green font-nova font-semibold text-sm mb-[8px] md:mb-[9px]">
            Supply Balance
          </div>
          <div className="mt-[2px] text-2xl font-space md:text-3xl">
            {toFiatString(totalSupplyBalanceInUsd)}
          </div>
        </div>
        <div className="w-full md:max-w-[487px] text-right  flex flex-col justify-center items-center">
          <div className="text-dark-green font-nova font-semibold text-sm mb-[8px] md:mb-[9px]">
            Borrow Balance
          </div>
          <div className="text-2xl font-space md:text-3xl">
            {toFiatString(totalBorrowedInUsd)}
          </div>
        </div>
      </div>
      <div className="gap-[5px] md:gap-0 flex flex-col text-xs justify-center font-nova pb-[15px] md:pb-[12px]">
        <div className="align-baseline justify-self-start text-xs text-[#818987] pb-0 md:pb-[6px] font-nova font-normal">
          Borrow Limit
        </div>
        <div className="flex justify-between items-center">
          <div className="mr-2 font-nova text-sm text-white">0%</div>
          <div className="font-nova text-sm text-white mr-[3px] md:mr-0">
            {toFiatString(borrowLimit)}
          </div>
        </div>
      </div>
      <div
        className="w-full h-full bg-green-300 mr-2 h-[5px] md:h-[4px] absolute bottom-0 left-0 zIndex-1 flex justify-end"
        style={{
          background:
            percentUsed > 79
              ? "linear-gradient(270deg, rgba(255, 0, 0.5) 0%, rgba(255, 0, 0, 1) 100%)"
              : "linear-gradient(270deg, #1BD6CF 0%, #00E5AF 100%)",
          width: borrowLimitUsed === "" ? 0 : `${percentUsed}%`,
          transition: "width 1s ease-out",
        }}
      >
        {borrowLimitUsed && (
          <span className="span-value">{borrowLimitUsed}%</span>
        )}
      </div>
      <div className="w-full flex absolute bottom-0 left-0">
        <div className="bg-[#262D2A] h-[4px] flex-grow"></div>
      </div>
    </div>
  );
}
