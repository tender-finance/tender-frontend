import SwapTable from "~/components/swap-table";
import AccountSummary from "~/components/account-summary";
import { TenderContext } from "~/contexts/tender-context";

export default function App() {
  // TODO: move to hook
  let tenderContextData = {
    tokenPairs: [],
  };

  return (
    <div className="c mt-32">
      <TenderContext.Provider value={tenderContextData}>
        <AccountSummary />
        <SwapTable />
      </TenderContext.Provider>
    </div>
  );
}
