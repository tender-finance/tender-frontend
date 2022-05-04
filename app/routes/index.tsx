import { Link } from "remix";
import SubscribeToNewsletter from "~/components/subscribe-to-newsletter";

export default function Index() {
  const coinDetails = [
    {
      num: "6",
      label: "Tokens",
    },
    {
      num: "100m+",
      label: "TLV",
    },
    {
      num: "10k+",
      label: "Investors",
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
              <button
                className="text-white bg-brand-green py-4 px-16"
                data-testid="enter-app"
              >
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
            <img
              width="600"
              src="/images/home-tree.svg"
              alt="Hero illustration of a tree with money and tubes"
            />
          </div>
        </div>
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
              the liquidity protocol and its governance.
            </div>
          </div>
          <div className="flex-grow">&nbsp;</div>
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div>
              <img
                className="w-52"
                src="/images/stakeholder-aurora.svg"
                alt="Aurora Mark"
              />
            </div>
            <div>
              <img
                className="w-52"
                src="/images/stakeholder-metapool.png"
                alt="Metapol Mark"
              />
            </div>
            <div>
              <img
                className="w-52"
                src="/images/stakeholder-ang.svg"
                alt="ANG Mark"
              />
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
