import * as animationData from "~/lotties/loader-tender.json";
// @ts-ignore NO types :(
import Lottie from "lottie-react";
import { useBlockchainExplorer } from "~/hooks/use-network-to-blockchain-explorer";
import { useContext } from "react";
import { TenderContext } from "~/contexts/tender-context";


interface Props {
  stopWaitingOnConfirmation: Function;
  txnHash: string | null;
}
export default function ConfirmingTransaction({
  stopWaitingOnConfirmation,
  txnHash,
}: Props) {
  let { isWaitingToBeMined } = useContext(TenderContext);
  let { blockExplorerUrl, blockExplorerName } = useBlockchainExplorer();

  return (
    <div className="pb-4 overflow-hidden">
      <div>
        <button
          onClick={() => stopWaitingOnConfirmation()}
          className="text-4xl rotate-45 text-gray-400 mr-8 float-right my-8"
        >
          +
        </button>
        <div
          className="flex w-full justify-center my-16"
          style={{ maxWidth: "100%" }}
        >
        {isWaitingToBeMined &&
          <Lottie
            animationData={animationData}
            style={{
              height: "250px",
              width: "250px",
            }}
          />
      }
        </div>
        <div className="uppercase text-center">
          {isWaitingToBeMined
            ? "Confirming transaction"
            : "Done!"
          }
          </div>
        {txnHash && (
          <div className="flex justify-center">
            <a
              href={`${blockExplorerUrl}/${txnHash}`}
              rel="noreferrer"
              target="_blank"
              style={{
                background: "linear-gradient(270deg, #1BD6CF 0%, #00E5AF 100%)",
              }}
              className="bg-brand-green text-gray-900 py-4 px-4 rounded-md text-sm my-8"
            >
              View on {blockExplorerName}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
