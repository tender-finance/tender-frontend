interface MaxProps {
  updateValue: Function;
  maxValue: string;
  maxValueLabel: string;
}
const formatMaxValue = (v: string): string => {
  return parseFloat(v).toFixed(2);
};
export default function Max(props: MaxProps) {
  return (
    <div className="absolute top right-0  text-right mr-10">
      <div className="text-gray-400 text-xs m-auto uppercase">
        Max Available
      </div>

      <div className="text-brand-green text-sm mb-4">
        {formatMaxValue(props.maxValue)} {props.maxValueLabel}
      </div>

      <button
        onClick={() => props.updateValue()}
        className="text-xs border-brand-green border-2 py-1 px-3 rounded-lg text-bg-brand-black-light uppercase text-green-300"
      >
        Max
      </button>
    </div>
  );
}
