import { TokenName } from "~/types/global";

interface TokenMetaDatum {
  icon: string;
  name: string;
  symbol: string;
  cTokenSymbol: string;
}

interface TokenMetaData {
  [TokenName.AAVE]: TokenMetaDatum;
  [TokenName.BAT]: TokenMetaDatum;
  [TokenName.DAI]: TokenMetaDatum;
  [TokenName.ETH]: TokenMetaDatum;
  [TokenName.LINK]: TokenMetaDatum;
  [TokenName.PAX]: TokenMetaDatum;
  [TokenName.SUSHI]: TokenMetaDatum;
  [TokenName.TUSD]: TokenMetaDatum;
  [TokenName.UNI]: TokenMetaDatum;
  [TokenName.USDC]: TokenMetaDatum;
  [TokenName.USDT]: TokenMetaDatum;
  [TokenName.WBTC]: TokenMetaDatum;
  [TokenName.YFI]: TokenMetaDatum;
  [TokenName.ZRX]: TokenMetaDatum;
}

const tokenMetaData: TokenMetaData = {
  [TokenName.AAVE]: {
    icon: "/images/coin-icons/aave.svg",
    name: "Aave",
    symbol: "AAVE",
    cTokenSymbol: "cAAVE",
  },
  [TokenName.BAT]: {
    icon: "/images/coin-icons/bat.svg",
    name: "BAT",
    symbol: "BAT",
    cTokenSymbol: "cBAT",
  },
  [TokenName.DAI]: {
    icon: "/images/coin-icons/dai.svg",
    name: "DAI",
    symbol: "DAI",
    cTokenSymbol: "cDAI",
  },
  [TokenName.ETH]: {
    icon: "/images/coin-icons/ethereum.svg",
    name: "Ethereum ETH",
    symbol: "ETH",
    cTokenSymbol: "cETH",
  },
  [TokenName.LINK]: {
    icon: "/images/coin-icons/chain.svg",
    name: "Chainlink",
    symbol: "LINK",
    cTokenSymbol: "cLINK",
  },
  [TokenName.PAX]: {
    icon: "/images/coin-icons/pax.svg",
    name: "Pax Dollar",
    symbol: "PAX",
    cTokenSymbol: "cPAX",
  },
  [TokenName.SUSHI]: {
    icon: "/images/coin-icons/sushi.svg",
    name: "Sushi Token",
    symbol: "SUSHI",
    cTokenSymbol: "cSUSHI",
  },
  [TokenName.TUSD]: {
    icon: "/images/coin-icons/tusd.svg",
    name: "TrueUSD",
    symbol: "TUSD",
    cTokenSymbol: "cTUSD",
  },
  [TokenName.UNI]: {
    icon: "/images/coin-icons/uni.svg",
    name: "Uniswap",
    symbol: "UNI",
    cTokenSymbol: "cUNI",
  },
  [TokenName.USDC]: {
    icon: "/images/coin-icons/usdc.svg",
    name: "USDC",
    symbol: "USDC",
    cTokenSymbol: "cUSDC",
  },
  [TokenName.USDT]: {
    icon: "/images/coin-icons/usdt.svg",
    name: "USDT",
    symbol: "USDT",
    cTokenSymbol: "cUSDT",
  },
  [TokenName.WBTC]: {
    icon: "/images/coin-icons/bitcoin.svg",
    name: "WBTC",
    symbol: "WBTC",
    cTokenSymbol: "cWBTC",
  },
  [TokenName.YFI]: {
    icon: "/images/coin-icons/yfi.svg",
    name: "yearn.finance",
    symbol: "YFI",
    cTokenSymbol: "cYFI",
  },
  [TokenName.ZRX]: {
    icon: "/images/coin-icons/zrx.svg",
    name: "0x",
    symbol: "ZRX",
    cTokenSymbol: "cZRX",
  },
};

export { tokenMetaData };
