import { LineWave } from "react-loader-spinner";
interface Props {
  stopWaitingOnConfirmation: Function;
}
export default function ConfirmingTransaction({
  stopWaitingOnConfirmation,
}: Props) {
  return (
    <div>
      <div>
        <button
          onClick={() => stopWaitingOnConfirmation()}
          className="text-4xl rotate-45 text-gray-400 mr-8 float-right my-8"
        >
          +
        </button>
        <div className="flex w-full justify-center my-16">
          <LineWave
            color="#54CE90"
            height={110}
            width={110}
            ariaLabel="three-circles-rotating"
          />
        </div>
        <div className="uppercase text-center">Confirming transaction</div>
      </div>
    </div>
  );
}
