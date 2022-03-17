import { TokenName } from "~/types/global";

interface TokenMetaDatum {
  icon: string;
  name: string;
  tokenName: string;
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
    tokenName: "BTC",
  },
  [TokenName.ETH]: {
    icon: "/images/coin-icons/ethereum.svg",
    name: "Ethereum ETH",
    tokenName: "ETH",
  },
  [TokenName.USDT]: {
    icon: "/images/coin-icons/tender.svg",
    name: "Tender USDT",
    tokenName: "USDT",
  },
};

export { tokenMetaData };
