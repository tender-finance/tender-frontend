import * as animationData from "~/lotties/loader-tender.json";
import Lottie from "react-lottie";

interface Props {
  stopWaitingOnConfirmation: Function;
}
export default function ConfirmingTransaction({
  stopWaitingOnConfirmation,
}: Props) {
  return (
    <div className="overflow-hidden">
      <div>
        <button
          onClick={() => stopWaitingOnConfirmation()}
          className="text-4xl rotate-45 text-gray-400 mr-8 float-right my-8"
        >
          +
        </button>
        <div className="flex w-full justify-center my-16 ">
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: animationData,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={300}
            width={300}
            isStopped={false}
            isPaused={false}
          />
        </div>
        <div className="uppercase text-center">Confirming transaction</div>
      </div>
    </div>
  );
}
