import { useState } from "react";
import ReactModal from "react-modal";
import { Market } from "~/types/global";
import DepositFlow from "../deposit-flow";

export default function MarketRow(props: {
  market: Market;
  children: React.ReactChild[];
}) {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>();
  return (
    <tr
      onClick={() => setIsDepositModalOpen(true)}
      className="text-gray-400 border-t border-t-gray-600 cursor-pointer"
    >
      {props.children}

      <ReactModal
        shouldCloseOnOverlayClick={true}
        isOpen={!!isDepositModalOpen}
        onRequestClose={() => setIsDepositModalOpen(false)}
        portalClassName="modal"
      >
        <DepositFlow
          closeModal={() => setIsDepositModalOpen(false)}
          market={props.market}
        />
      </ReactModal>
    </tr>
  );
}
