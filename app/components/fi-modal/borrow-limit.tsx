import { toFiatString } from "~/lib/ui";

interface BorrowLimitProps {
  value: string;
  isValid: boolean;
  borrowLimit: number;
  newBorrowLimit: number;
  borrowLimitUsed: string;
  newBorrowLimitUsed: string;
}

export default function BorrowLimit(props: BorrowLimitProps) {
  const {
    value,
    isValid,
    borrowLimit,
    newBorrowLimit,
    borrowLimitUsed,
    newBorrowLimitUsed,
  } = props;

  return (
    <div>
      <div className="font-bold mr-3 border-b border-[#282C2B] font-nova text-xl w-full pb-5">
        Borrow Limit
      </div>

      <div className="flex items-center text-[#ADB5B3] font-nova text-base  border-b border-[#282C2B] py-5">
        <div className="flex-grow">Borrow Limit </div>
        <div>
          {(value == "0" || !isValid) && <>{toFiatString(borrowLimit)}</>}
          {isValid && value != "0" && (
            <>
              {toFiatString(borrowLimit)}{" "}
              <span className="text-brand-green">→</span>
              {toFiatString(newBorrowLimit)}
            </>
          )}
          {}
        </div>
      </div>

      <div className="flex items-center text-[#ADB5B3] font-nova text-base pt-5 pb-8">
        <div className="flex-grow">Borrow Limit</div>
        <div className="text-white text-base font-nova">
          {(value == "0" || !isValid) && <>{borrowLimitUsed}%</>}
          {isValid && value != "0" && (
            <>
              {borrowLimitUsed}% <span className="text-[#14f195]">→ </span>
              {newBorrowLimitUsed}%
            </>
          )}
        </div>
      </div>
    </div>
  );
}
