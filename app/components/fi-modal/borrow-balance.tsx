import { toMoneyString } from "~/lib/ui";

interface BorrowBalanceProps {
  value: string;
  isValid: boolean;
  borrowBalance: number;
  newBorrowBalance: number;
  borrowLimitUsed: string;
  newBorrowLimitUsed: string;
}

export default function BorrowBalance(props: BorrowBalanceProps) {
  const {
    value,
    isValid,
    borrowBalance,
    newBorrowBalance,
    borrowLimitUsed,
    newBorrowLimitUsed,
  } = props;
  return (
    <div>
      <div className="font-bold mr-3 border-b border-b-gray-600 w-full pb-5">
        Borrow Limit
      </div>

      <div className="flex items-center mb-3 text-gray-400 border-b border-b-gray-600 py-5">
        <div className="flex-grow">Borrow Balance</div>
        <div>
          {(value == "0" || !isValid) && <>{toMoneyString(borrowBalance)}</>}
          {isValid && value != "0" && (
            <>
              {toMoneyString(borrowBalance)}{" "}
              <span className="text-brand-green">→</span> $
              {toMoneyString(newBorrowBalance)}
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
