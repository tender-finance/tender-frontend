interface MaxProps {
  updateValue: Function;
  maxValue: string;
  maxValueLabel: string;
}
export default function Max(props: MaxProps) {
  return (
    <div className="absolute top right-0  text-right mr-10">
      <div className="text-gray-400 text-xs m-auto uppercase">
        Max Available
      </div>

      <div className="text-brand-green text-sm mb-4">
        {props.maxValue} {props.maxValueLabel}
      </div>

      <button
        onClick={() => props.updateValue()}
        className="text-xs border-brand-green border-2 py-0.5 px-2 rounded-lg text-bg-brand-black-light uppercase text-green-300"
      >
        Use
      </button>
    </div>
  );
}
