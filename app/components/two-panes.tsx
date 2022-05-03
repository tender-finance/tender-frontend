export default function TwoPanes() {
  return (
    <div className="grid grid-cols-2 gap-5">
      {/* Supply */}
      <div>
        <div className="pane mb-9 ">
          <div className="px-8 py-6 text-brand-green text-2xl border-b border-b-gray-500">
            Supply
          </div>
          <div className="border-b border-b-gray-500 py-4 text-sm text-gray-300">
            Asset / apy / balance / collateral
          </div>
          <div>Row</div>
        </div>
        <div className="pane">all markets Supply</div>
      </div>
      {/* Borrowing*/}
      <div>
        <div className="pane mb-9 ">
          <div className="px-8 py-6 text-2xl text-brand-blue">Borrowing</div>
        </div>
        <div className="pane">all markets borrowing</div>
      </div>
    </div>
  );
}
