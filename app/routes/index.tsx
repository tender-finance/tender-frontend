import AccountSummary from "~/components/account-summary";
import { TenderContext } from "~/contexts/tender-context";
import { useTenderContext } from "~/hooks/use-tender-context";
import TwoPanes from "~/components/two-panes";

export default function App() {
  let tenderContextData = useTenderContext();

  return (
    <div className="c mt-32">
      {tenderContextData && (
        <TenderContext.Provider value={tenderContextData}>
          <AccountSummary />
          <TwoPanes />
        </TenderContext.Provider>
      )}

      {!tenderContextData && <div className="py-12">Loading</div>}
    </div>
  );
}
