import { Link } from "remix";
import SubscribeToNewsletter from "~/components/subscribe-to-newsletter";
import SwapTable from "~/components/swap-table";
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

      <div className="c">
        <SwapTable />
      </div>
      <div className="c mb-96">
        <div className="flex">
          <div className="max-w-sm ">
            <div className="text-7xl text-heading mb-6">
              Stake
              <br /> Holders
            </div>
            <div className="leading-loose">
              These stakeholders actively contribute as part of the community to
              the Aave Protocol and its governance.
            </div>
          </div>
          <div className="flex-grow">&nbsp;</div>
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div>
              <img className="w-52" src="/images/logo4.png" />
            </div>
            <div>
              <img className="w-52" src="/images/logo1.png" />
            </div>
            <div>
              <img className="w-52" src="/images/logo3.png" />
            </div>
            <div>
              <img className="w-52" src="/images/logo2.png" />
            </div>
          </div>
        </div>
      </div>
      <div className="c">
        <SubscribeToNewsletter />
      </div>
    </div>
  );
}
