import ReactModal from "react-modal";
import type { Market } from "~/types/global";

ReactModal.setAppElement("#m");

export default function MarketRow(props: {
  market: Market;
  children: React.ReactChild[];
  openMarket: Function;
}) {

  return (
    <tr
      onClick={() => props.openMarket()}
      className="text-gray-400 border-t border-t-gray-600 cursor-pointer"
    >
      {props.children}
    </tr>
  );
}
