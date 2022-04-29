interface Props {
  close: Function;
}
export default function TransactionHasErrors({ close }: Props) {
  return (
    <div className="p-16">
      <div>
        <button
          onClick={() => close()}
          className="text-4xl rotate-45 text-gray-400 mr-8 float-right "
        >
          +
        </button>
      </div>
      Ahhh, there's errors
    </div>
  );
}
