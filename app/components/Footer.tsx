export default function Footer() {
  interface Link {
    label: string;
    url: string;
  }
  let productLinks: Link[] = [
    {
      label: "Tender Protocol",
      url: "#tender-protocol",
    },
    {
      label: "Developers",
      url: "#developers",
    },
    {
      label: "Security",
      url: "#security",
    },
    {
      label: "Tokens",
      url: "#tokens",
    },
    {
      label: "Bug Bounty",
      url: "#bug-bounty",
    },
    {
      label: "Flash Loans",
      url: "#flash-loans",
    },
  ];

  let resourceLinks: Link[] = [
    {
      label: "Rate Switching",
      url: "#rate-switching",
    },
    {
      label: "Whitepaper",
      url: "#whitepaper",
    },
    {
      label: "Tokenomics",
      url: "#tokenomic",
    },
    {
      label: "Ecosystem",
      url: "#ecosystem",
    },
    {
      label: "Careers",
      url: "#careers",
    },
    {
      label: "Branding",
      url: "#branding",
    },
  ];

  let companyLinks: Link[] = [
    {
      label: "Blog",
      url: "#blog",
    },
    {
      label: "Terms of use",
      url: "#terms-of-use",
    },
    {
      label: "Contact",
      url: "#contact",
    },
    {
      label: "Privacy Policy",
      url: "#privacy-policy",
    },
    {
      label: "Cookie Policy",
      url: "#cookie-policy",
    },
  ];
  return (
    <div className="border-t border-t-gray-700">
      <div className="c grid grid-cols-4 mt-14 mb-24">
        <div>
          <div className="heading mb-5 text-lg">Product</div>
          {productLinks.map(({ url, label }) => (
            <div key={url} className="mb-4 text-sm font-light">
              <a href={url} className="text-gray-500">
                {label}
              </a>
            </div>
          ))}
        </div>
        <div>
          <div className="heading mb-5">Resources</div>
          {resourceLinks.map(({ url, label }) => (
            <div key={url} className="mb-4 text-sm font-light">
              <a href={url} className="text-gray-500">
                {label}
              </a>
            </div>
          ))}
        </div>
        <div>
          <div className="heading mb-5">Company</div>
          {companyLinks.map(({ url, label }) => (
            <div key={url} className="mb-4 text-sm font-light">
              <a href={url} className="text-gray-500">
                {label}
              </a>
            </div>
          ))}
        </div>
        <div>
          <div className="heading mb-5">Get in touch</div>

          <div className="mb-8 text-sm font-light text-gray-500">
            We want to hear from you. Find us on social media
          </div>
          <div className="flex">
            <a href="#" className="mr-3">
              <img src="/images/facebook-icon.svg" />
            </a>
            <a href="#" className="mr-3">
              <img src="/images/twitter-icon.svg" />
            </a>
            <a href="#" className="mr-3">
              <img src="/images/li-icon.svg" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
