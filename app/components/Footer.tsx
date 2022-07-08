export default function Footer() {
  interface Link {
    label: string;
    url: string;
    ico: string;
  }
  let productLinks: Link[] = [
    {
      label: "Docs",
      url: "https://docs.tender.fi",
      ico: "/images/ico/list.svg",
    },
    {
      label: "GitHub",
      url: "https://github.com/tender-finance/front-end",
      ico: "/images/ico/git.svg",
    },
    {
      label: "Support",
      url: "mailto:support@tender.fi",
      ico: "/images/ico/email.svg",
    },
  ];

  let resourceLinks: Link[] = [
    {
      label: "Telegram",
      url: "http://t.me/tender_fi",
      ico: "/images/ico/telegram.svg",
    },
    {
      label: "Twitter",
      url: "https://twitter.com/tender_fi",
      ico: "/images/ico/twitter.svg",
    },
    {
      label: "Discord",
      url: "https://discord.com/invite/aKZ8hDBvYG",
      ico: "/images/ico/discord.svg",
    },
  ];

  return (
    <div className="c h-[120px] border-t md:border-none border-[#2B2B2B] flex-col-reverse justify-center items-center md:flex-row justify-between items-center flex max-w-[1400px] md:h-[62px]">
      <div className="mb-[30px] md:mb-5 md:mb-0">
        <a href="/">
          <img
            className="w-[120px] h-[20px]"
            src="images/ico/smallLogo.svg"
            alt="..."
          />
        </a>
      </div>
      <div className=" pt-[30px] flex gap-[20px] md:flex md:py-4 justify-center items-center">
        {productLinks.map((item, index) => {
          return (
            <a className="" href={item.url} key={index}>
              <img
                className="icons-color w-[20px] h-[20px] md:w-[20px] md:h-[20px]"
                src={item.ico}
                alt=""
              />
            </a>
          );
        })}
        {resourceLinks.map((item, index) => {
          return (
            <a className="" key={index} href={item.url}>
              <img
                className="icons-color md:w-[20px] md:h-[20px]"
                src={item.ico}
                alt=""
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
