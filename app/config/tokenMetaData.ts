import { TokenName } from "~/types/global";

interface TokenMetaDatum {
  icon: string;
  name: string;
  symbol: string;
  cTokenSymbol: string;
}

interface TokenMetaData {
  [TokenName.WBTC]: TokenMetaDatum;
  [TokenName.USDC]: TokenMetaDatum;
  [TokenName.USDT]: TokenMetaDatum;
  [TokenName.ETH]: TokenMetaDatum;
  [TokenName.DAI]: TokenMetaDatum;
}

const tokenMetaData: TokenMetaData = {
  [TokenName.WBTC]: {
    icon: "/images/coin-icons/bitcoin.svg",
    name: "WBTC",
    symbol: "WBTC",
    cTokenSymbol: "cWBTC",
  },
  [TokenName.ETH]: {
    icon: "/images/coin-icons/ethereum.svg",
    name: "Ethereum ETH",
    symbol: "ETH",
    cTokenSymbol: "cETH",
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
  [TokenName.DAI]: {
    icon: "/images/coin-icons/tender.svg",
    name: "DAI",
    symbol: "DAI",
    cTokenSymbol: "cDAI",
  },
};

export { tokenMetaData };
