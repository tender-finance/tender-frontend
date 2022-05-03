import SwapTable from "~/components/swap-table";
import AccountSummary from "~/components/account-summary";
import { TenderContext } from "~/contexts/tender-context";
import { useTenderContext } from "~/hooks/use-tender-context";

export default function App() {
  let tenderContextData = useTenderContext();

  return (
    <div className="c mt-32">
      {tenderContextData && (
        <TenderContext.Provider value={tenderContextData}>
          <AccountSummary />
          <SwapTable />
        </TenderContext.Provider>
      )}

      {!tenderContextData && <div>Loading</div>}
    </div>
  );
}
