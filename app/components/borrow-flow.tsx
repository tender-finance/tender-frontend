import { SwapRow } from "~/types/global";

import { useState } from "react";

interface Props {
  closeModal: Function;
  row: SwapRow;
}
export default function BorrowFlow({ closeModal, row }: Props) {
  let [isBorrowing, setIsBorrowing] = useState<boolean>(true);
  return isBorrowing ? (
    <div>
      <div className="py-8" style={{ backgroundColor: "#23262B" }}>
        <div className="float-right">
          <button
            onClick={() => closeModal()}
            className="text-4xl rotate-45 text-gray-400 mr-8"
          >
            +
          </button>
        </div>
        <div className="flex align-middle justify-center items-center">
          <div className="mr-4">
            <img src={row.icon} />
          </div>
          <div>Deposit {row.name}</div>
        </div>
      </div>
      <div className="flex">
        <button
          className="flex-grow py-3 text-brand-green border-b-2 border-b-brand-green"
          onClick={() => setIsBorrowing(true)}
        >
          Borrow
        </button>
        <button
          className="flex-grow py-3"
          onClick={() => setIsBorrowing(false)}
        >
          Repay
        </button>
      </div>
      <div className="p-6" style={{ background: "#1C1E22" }}>
        DEFI!
      </div>
    </div>
  ) : (
    <div>
      <div>
        <div className="py-8" style={{ backgroundColor: "#23262B" }}>
          <div className="float-right">
            <button
              onClick={() => closeModal()}
              className="text-4xl rotate-45 text-gray-400 mr-8"
            >
              +
            </button>
          </div>
          <div className="flex align-middle justify-center items-center">
            <div className="mr-4">
              <img src={row.icon} />
            </div>
            <div>Deposit {row.name}</div>
          </div>
        </div>
        <div className="flex">
          <button
            className="flex-grow py-3"
            onClick={() => setIsBorrowing(true)}
          >
            Borrow
          </button>
          <button
            className="flex-grow py-3 text-brand-green border-b-2 border-b-brand-green"
            onClick={() => setIsBorrowing(false)}
          >
            Repay
          </button>
        </div>
        <div className="p-6" style={{ background: "#1C1E22" }}>
          DEFI!
        </div>
      </div>
    </div>
  );
}
