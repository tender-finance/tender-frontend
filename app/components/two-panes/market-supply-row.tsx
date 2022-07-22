import { useState } from "react";
import ReactModal from "react-modal";
import type { Market } from "~/types/global";
import DepositFlow from "../deposit-flow";

ReactModal.setAppElement("#m");

export default function MarketRow(props: {
  market: Market;
  children: React.ReactChild[];
}) {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>();
  /* Because the modal is nested in the <TR> we have to have an extra
   * layer of protection when toggling visibility to keep double calling
   */
  const [sillyMutex, setSillyMutex] = useState<boolean>(false);
  const openModal = () => {
    if (!sillyMutex) {
      setIsDepositModalOpen(true);
      setSillyMutex(true);
    } else {
      setSillyMutex(false);
    }
  };

  const closeModal = () => {
    setSillyMutex(true);
    setIsDepositModalOpen(false);
  };
  return (
    <tr
      onClick={() => openModal()}
      className="border-t border-[#282C2B] cursor-pointer"
    >
      {props.children}

      <ReactModal
        shouldCloseOnOverlayClick={true}
        isOpen={!!isDepositModalOpen}
        onRequestClose={() => closeModal()}
        portalClassName="modal"
      >
        <DepositFlow closeModal={() => closeModal()} market={props.market} />
      </ReactModal>
    </tr>
  );
}
