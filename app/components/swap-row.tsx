import type { SwapRow } from "~/types/global";
import ReactModal from "react-modal";
import { useState } from "react";

interface Props {
  row: SwapRow;
}

ReactModal.setAppElement("#m");

export default function SwapRow({ row }: Props) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>();
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
          <div>{row.marketSize}</div>
          <div>{row.totalBorrowed}</div>
          <div>{row.depositApy}</div>
          <div>{row.borrowApy}</div>
        </div>
        <div>
          <button
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="border rounded py-3 px-8 mr-3"
          >
            Deposit
          </button>
          <button className="border border-transparent text-white rounded py-3 px-8 bg-brand-green">
            Borrow
          </button>
        </div>
      </div>
      <div>
        <ReactModal
          shouldCloseOnOverlayClick={true}
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(!isModalOpen)}
          portalClassName="modal"
        >
          <div>
            <div className="py-8" style={{ backgroundColor: "#23262B" }}>
              <div className="float-right">
                <button
                  onClick={() => setIsModalOpen(!isModalOpen)}
                  className="text-4xl rotate-45 text-gray-400 mr-8"
                >
                  +
                </button>
              </div>

              <div className="flex align-middle justify-center items-center">
                <div className="mr-4">
                  <img src={row.icon} />
                </div>
                <div>{row.name}</div>
              </div>
            </div>
            <div className="p-6" style={{ background: "#1C1E22" }}>
              DEFI!
            </div>
          </div>
        </ReactModal>
      </div>
    </div>
  );
}
