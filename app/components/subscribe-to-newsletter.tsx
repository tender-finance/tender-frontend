export default function SubscribeToNewsletter() {
  return (
    <div className="text-brand-black text-center rounded-2xl max-w-5xl m-auto mb-32 pb-1 bg-white">
      <div className="heading pt-24 text-5xl mb-3">
        Subscribe to our newsletter
      </div>
      <div className="max-w-lg m-auto mb-6">
        Tender is an open source and non-custodial liquidity protocol for
        earning interest on deposits and borrowing assets.
      </div>
      <div className="inline-block m-auto mb-20 ">
        <button className="flex bg-brand-black text-white px-12 py-5">
          Subscribe
          <img
            src="/images/right-arrow.svg"
            className="ml-2"
            alt="Arrow pointing right"
          />
        </button>
      </div>
    </div>
  );
}
