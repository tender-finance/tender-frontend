import { Link } from "remix";
import SubscribeToNewsletter from "~/components/subscribe-to-newsletter";
export default function Index() {
  const coinDetails = [
    {
      num: "32k+",
      label: "Coins",
    },
    {
      num: "20k+",
      label: "Auctions",
    },
    {
      num: "10k+",
      label: "Artists",
    },
  ];
  return (
    <div className="c ">
      <div className="flex mb-44">
        <div className="mt-64 flex-grow">
          <div className="text-7xl text-heading mb-6">
            The Liquidity
            <br /> Protocol
          </div>
          <div className="mb-12 max-w-lg">
            Tender is an open source and non-custodial liquidity protocol for
            earning interest on deposits and borrowing assets.
          </div>
          <div className="mb-16">
            <Link to="/app">
              <button className="text-white bg-brand-green py-4 px-16">
                Enter App
              </button>
            </Link>
          </div>
          <div className="flex">
            {coinDetails.map(({ num, label }) => {
              return (
                <div key={label} className="mr-16">
                  <div className="text-heading text-4xl">{num}</div>
                  <div>{label}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="mt-32">
            <img width="530" src="/images/money-tree.svg" />
          </div>
        </div>
      </div>

      <div>Conversion Table</div>
      <div>Stake Holders</div>
      <div className="c">
        <SubscribeToNewsletter />
      </div>
    </div>
  );
}
