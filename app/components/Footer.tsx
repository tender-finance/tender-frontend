export default function Footer() {
  interface Link {
    label: string;
    url: string;
  }
  let productLinks: Link[] = [
    {
      label: "Docs",
      url: "https://docs.tender.fi",
    },
    {
      label: "GitHub",
      url: "https://github.com/tender-finance/front-end",
    },
    {
      label: "Support",
      url: "mailto:support@tender.fi",
    },
  ];

  let resourceLinks: Link[] = [
    {
      label: "Telegram",
      url: "http://t.me/tender_fi",
    },
    {
      label: "Twitter",
      url: "https://twitter.com/tender_fi",
    },
    {
      label: "Discord",
      url: "https://discord.gg/CD2hKamT",
    },
  ];
  
  let companyLinks: Link[] = [
    {
      label: "Blog",
      url: "https://tender-finance.medium.com/",
    },
    {
      label: "Youtube",
      url: "https://www.youtube.com/channel/UCGMP8qwS9SoWRvsd-srnExg/",
    },
    {
      label: "Careers",
      url: "https://triplebyte.com/company/public/ang-sciences",
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
            <a href="https://twitter.com/tender_finance" className="mr-3">
              <img src="/images/twitter-icon.svg" alt="Link to twitter" />
            </a>
            <a
              href="https://www.linkedin.com/company/80238010"
              className="mr-3"
            >
              <img src="/images/li-icon.svg" alt="Link to LinkedIn" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
