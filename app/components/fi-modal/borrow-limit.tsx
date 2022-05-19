import { Details } from "~/hooks/use-valid-input";

interface BorrowLimitProps {
  value: string;
  isValid: boolean;
  borrowLimit: number;
  newBorrowLimit: number;
  borrowLimitUsed: string;
  newBorrowLimitUsed: string;
}

const formatBorrowLimit = (v: number): string => {
  return v.toFixed(2).toString();
};

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
      <div className="font-bold mr-3 border-b border-b-gray-600 w-full pb-5">
        Borrow Limit
      </div>

      <div className="flex items-center mb-3 text-gray-400 border-b border-b-gray-600 py-5">
        <div className="flex-grow">Borrow Limit </div>
        <div>
          {(value == "0" || !isValid) && <>${formatBorrowLimit(borrowLimit)}</>}
          {isValid && value != "0" && (
            <>
              ${formatBorrowLimit(borrowLimit)}{" "}
              <span className="text-brand-green">→</span> $
              {formatBorrowLimit(newBorrowLimit)}
            </>
          )}
          {}
        </div>
      </div>

      <div className="flex items-center mb-3 text-gray-400 border-b border-b-gray-600 py-5">
        <div className="flex-grow">Borrow Limit Used</div>
        <div>
          {(value == "0" || !isValid) && <>{borrowLimitUsed}%</>}
          {isValid && value != "0" && (
            <>
              {borrowLimitUsed}% <span className="text-brand-green">→ </span>
              {newBorrowLimitUsed}%
            </>
          )}
        </div>
      </div>
    </div>
  );
}
