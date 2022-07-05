import Ring from "./ring";

const formatCurrency = (v: number): string => {
  return `$${v.toFixed(2)}`;
};

export default function AccountSummary() {
  let totalSupplyBalanceInUsd = 0;
  let totalBorrowedInUsd = 0;
  let borrowLimit = 0;
  let borrowLimitUsed = 0;

  return (
    <div
      className="mb-20 border-custom px-4 relative"
      style={{
        borderRadius: "1rem 1rem 0 0",
        background: `linear-gradient(
      
      #111111 0%,
      rgba(0, 34, 29, .7) 100%
    )`,
      }}
    >
      <div
        className="absolute w-[130px] h-[130px] top-[-80px] left-[50%] translate-x-[-50%] rounded-full md:w-[200px] md:h-[200px] md:top-[-64px]"
        style={{
          background:
            "linear-gradient(135deg, rgba(10, 10, 10, 0.12) 0%, rgba(20, 242, 185, .3) 100%), #111",
        }}
      >
        <div className="flex flex-col h-full justify-center items-center">
          <div className="uppercase text-[#818987] font-nova font-medium text-sm">
            Net APY
          </div>

          <div className="absolute top-0 right-0"></div>
          <div className="absolute top-0 right-0"></div>
          <div className="text-2xl md:text-4xl font-space font-normal">--</div>
          <div className="absolute md:top-[22px] md:right-[20px]"></div>
        </div>
      </div>
      <div className="flex flex-col items-center mt-16 pt-[85px] md:flex-row justify-between my-6 mb-[44px] md:pt-[55px] md:my-6">
        <div className="w-full md:max-w-[470px] flex flex-col justify-center items-center mb-[34px] md:mb-0">
          <div className="text-dark-green font-nova font-semibold text-sm mb-[8px] md:mb-4">
            Supply Balance
          </div>
          <div className="text-2xl font-space md:text-3xl">
            {formatCurrency(totalSupplyBalanceInUsd)}
          </div>
        </div>
        <div className="w-full md:max-w-[470px] text-right  flex flex-col justify-center items-center">
          <div className="text-dark-green font-nova font-semibold text-sm mb-[8px] md:mb-4">
            Borrow Balance
          </div>
          <div className="text-2xl font-space md:text-3xl">
            {formatCurrency(totalBorrowedInUsd)}
          </div>
        </div>
      </div>
      <div className="flex flex-col text-xs justify-center font-nova pb-4">
        <div className="justify-self-start text-xs text-[#818987] pb-1 font-nova font-normal">
          Borrow Limit
        </div>
        <div className="flex justify-between items-center">
          <div className="mr-2 font-nova text-sm text-white">
            {borrowLimitUsed}%
          </div>
          <div className="font-nova text-sm text-white">
            {formatCurrency(borrowLimit)}
          </div>
        </div>
      </div>
      <div className="w-full flex absolute bottom-0 left-0">
        <div className="bg-[#262D2A] h-[4px] flex-grow"></div>
      </div>
    </div>
  );
}
