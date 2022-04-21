interface MaxProps {
  updateValue: Function;
  maxValue: string;
  maxValueLabel: string;
}
export default function Max(props: MaxProps) {
  return (
    <div>
      <div
        className="text-gray-400 text-sm m-auto"
        onClick={() => props.updateValue()}
      >
        Max ⬆
      </div>

      <div>
        {props.maxValue} {props.maxValueLabel}
      </div>
    </div>
  );
}
