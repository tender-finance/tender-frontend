import type { SwapRow, SwapRowMarketDatum } from "~/types/global";
import ReactModal from "react-modal";
import { useState } from "react";
import DepositFlow from "./deposit-flow";
import BorrowFlow from "./borrow-flow";

interface Props {
  row: SwapRow;
  showUsd: boolean;
  marketData: SwapRowMarketDatum;
}

ReactModal.setAppElement("#m");

export default function SwapRow({ row, showUsd, marketData }: Props) {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>();
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState<boolean>();
  return (
    <div>
      <div className="py-6 flex align-middle items-center border-b border-b-gray-700 font-light text-gray-300">
        <div className="flex items-center align-middle">
          <div className="mr-4">
            <img src={row.icon} />
          </div>
          <div style={{ width: "250px" }}>{row.name}</div>
        </div>
        <div className="grid grid-cols-4 flex-grow">
          {showUsd ? (
            <div>{row.marketSizeUsd}</div>
          ) : (
            <div>{row.marketSizeNative}</div>
          )}
          {showUsd ? (
            <div>{row.totalBorrowedUsd}</div>
          ) : (
            <div>{row.totalBorrowedNative}</div>
          )}
          <div>{marketData.depositApy || "-"}</div>
          <div>{marketData.borrowApy || "-"}</div>
        </div>
        <div>
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="border rounded py-3 px-8 mr-3"
          >
            Deposit
          </button>
          <button
            onClick={() => setIsBorrowModalOpen(true)}
            className="border border-transparent text-white rounded py-3 px-8 bg-brand-green"
          >
            Borrow
          </button>
        </div>
      </div>
      <div>
        <ReactModal
          shouldCloseOnOverlayClick={true}
          isOpen={!!isDepositModalOpen}
          onRequestClose={() => setIsDepositModalOpen(false)}
          portalClassName="modal"
        >
          <DepositFlow
            closeModal={() => setIsDepositModalOpen(false)}
            row={row}
            marketData={marketData}
          />
        </ReactModal>

        <ReactModal
          shouldCloseOnOverlayClick={true}
          isOpen={!!isBorrowModalOpen}
          onRequestClose={() => setIsBorrowModalOpen(false)}
          portalClassName="modal"
        >
          <BorrowFlow
            closeModal={() => setIsBorrowModalOpen(false)}
            row={row}
            marketData={marketData}
          />
        </ReactModal>
      </div>
    </div>
  );
}
