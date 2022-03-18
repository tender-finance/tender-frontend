import { TokenName } from "~/types/global";

interface TokenMetaDatum {
  icon: string;
  name: string;
  symbol: string;
  cTokenSymbol: string;
}

interface TokenMetaData {
  [TokenName.BTC]: TokenMetaDatum;
  [TokenName.USDT]: TokenMetaDatum;
  [TokenName.ETH]: TokenMetaDatum;
}

const tokenMetaData: TokenMetaData = {
  [TokenName.BTC]: {
    icon: "/images/coin-icons/bitcoin.svg",
    name: "Bitcoin BTC",
    symbol: "BTC",
    cTokenSymbol: "WBTC",
  },
  [TokenName.ETH]: {
    icon: "/images/coin-icons/ethereum.svg",
    name: "Ethereum ETH",
    symbol: "ETH",
    cTokenSymbol: "cETH",
  },
  [TokenName.USDT]: {
    icon: "/images/coin-icons/tender.svg",
    name: "Tender USDT",
    symbol: "USDT",
    cTokenSymbol: "cUSDC",
  },
};

export { tokenMetaData };
