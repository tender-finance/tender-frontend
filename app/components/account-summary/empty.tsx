const formatCurrency = (v: number): string => {
  return `$${v.toFixed(2)}`;
};

export default function AccountSummary() {
  let totalSupplyBalanceInUsd = 0;
  let totalBorrowedInUsd = 0;
  let borrowLimit = 0;
  let borrowLimitUsed = 0;

  return (
    <div className="border-custom px-4 relative top__custom">
      <div className="absolute w-[130px] h-[130px] top-[-80px] left-[50%] translate-x-[-50%] rounded-full md:w-[200px] md:h-[200px] md:top-[-67px] top__custom__value">
        <div className="flex flex-col h-full justify-center items-center">
          <div className="uppercase text-[#818987] text-[13px] leading-[170%] tracking-widest font-nova font-medium text-sm transform-custom">
            Net APY
          </div>

          <div className="absolute top-0 right-0"></div>
          <div className="absolute top-0 right-0"></div>
          <div className="text-2xl md:text-4xl font-space font-normal">--</div>
          <div className="absolute top-[50%] left-[50%] translate__50 items-center flex justify-center"></div>
        </div>
      </div>
      <div className="flex flex-col items-center mt-16 pt-[85px] md:flex-row justify-between my-6 mb-[44px] md:pt-[56px] md:my-6">
        <div className="w-full md:max-w-[485px] flex flex-col justify-center items-center mb-[34px] md:mb-0">
          <div className="text-dark-green font-nova font-semibold text-sm mb-[8px] md:mb-[9px]">
            Supply Balance
          </div>
          <div className="text-2xl font-space md:text-3xl">
            {formatCurrency(totalSupplyBalanceInUsd)}
          </div>
        </div>
        <div className="w-full md:max-w-[487px] text-right  flex flex-col justify-center items-center">
          <div className="text-dark-green font-nova font-semibold text-sm mb-[8px] md:mb-[9px]">
            Borrow Balance
          </div>
          <div className="text-2xl font-space md:text-3xl">
            {formatCurrency(totalBorrowedInUsd)}
          </div>
        </div>
      </div>
      <div className="flex flex-col text-xs justify-center font-nova pb-4">
        <div className="justify-self-start text-xs text-[#818987] pb-[6px] font-nova font-normal">
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
