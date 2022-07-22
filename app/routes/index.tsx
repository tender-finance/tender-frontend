import AccountSummary from "~/components/account-summary";
import AccountSummaryEmpty from "~/components/account-summary/empty";
import { TenderContext } from "~/contexts/tender-context";
import { useTenderContext } from "~/hooks/use-tender-context";
import TwoPanes from "~/components/two-panes";

export default function App() {
  let tenderContextData = useTenderContext();

  return (
    <div
      className="c mt-[172px] md:mt-[240px] mb-[107px]"
      data-testid="app-frame"
    >
      {tenderContextData && (
        <TenderContext.Provider value={tenderContextData}>
          <AccountSummary />
          <TwoPanes />
        </TenderContext.Provider>
      )}

      {!tenderContextData && (
        <div className="pt-12">
          <AccountSummaryEmpty />
        </div>
      )}
    </div>
  );
}
