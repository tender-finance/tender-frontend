import type {
  Market,
  Token,
  TokenPair,
  cToken as cTokenType,
} from "~/types/global";
import type { ComponentStory, ComponentMeta } from "@storybook/react";

import Deposit, {
  type DepositProps,
} from "../../../../app/components/deposit-flow/deposit";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Tender/ModalFlows/Deposit",
  component: Deposit,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof Deposit>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Deposit> = (args) => (
  <Deposit {...args} />
);

export const Primary = Template.bind({});
export const SmallNumbers = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
let cToken: cTokenType = {
  name: "cTok",
  address: "0x01",
  decimals: 18,
  symbol: "cTok",
};

let token: Token = {
  priceInUsd: 2,
  symbol: "TOK",
  icon: "/images/coin-icons/metis.png",
  name: "token",
  decimals: 18,
  priceDecimals: 18,
  address: "0x02",
  cToken,
};

let tokenPair: TokenPair = {
  token,
  cToken,
};

let market: Market = {
  id: "000",
  tokenPair,
  marketData: {
    depositApy: "99.99%",
    borrowApy: "66.66%",
    totalBorrowedUsd: "200000000",
    marketSizeUsd: "3000000000000000",
  },
  walletBalance: 40000000000,
  supplyBalance: 500000000000,
  supplyBalanceInUsd: 20000000000,
  borrowBalance: 8000000000,
  borrowBalanceInUsd: 16000,
  borrowLimit: 4000,
  borrowLimitUsedOfToken: "10",
  borrowLimitUsed: "20",
  totalBorrowedAmountInUsd: 43434343,
  comptrollerAddress: "0x03",
  maxBorrowLiquidity: 10000200000,
};
let tokenPairs: TokenPair[] = [tokenPair];

Primary.args = {
  market,
  closeModal: () => {},
  setIsSupplying: () => {},
  signer: null,
  borrowLimit: market.borrowLimit,
  borrowLimitUsed: market.borrowLimitUsed,
  walletBalance: market.walletBalance,
  tokenPairs,
  totalBorrowedAmountInUsd: market.totalBorrowedAmountInUsd,
  comptrollerAddress: market.comptrollerAddress,
} as DepositProps;

let smallMarket: Market = {
  id: "000",
  tokenPair,
  marketData: {
    depositApy: "0.99%",
    borrowApy: "0.06%",
    totalBorrowedUsd: "0.1",
    marketSizeUsd: "0.9",
  },
  walletBalance: 0.00002,
  supplyBalance: 0.00002,
  supplyBalanceInUsd: 0.00002,
  borrowBalance: 0.00002,
  borrowBalanceInUsd: 0.00002,
  borrowLimit: 0.00002,
  borrowLimitUsedOfToken: "0.002",
  borrowLimitUsed: "0.01",
  totalBorrowedAmountInUsd: 0.2,
  comptrollerAddress: "0x03",
  maxBorrowLiquidity: 0.7,
};

SmallNumbers.args = {
  market: smallMarket,
  closeModal: () => {},
  setIsSupplying: () => {},
  signer: null,
  borrowLimit: smallMarket.borrowLimit,
  borrowLimitUsed: smallMarket.borrowLimitUsed,
  walletBalance: smallMarket.walletBalance,
  tokenPairs,
  totalBorrowedAmountInUsd: smallMarket.totalBorrowedAmountInUsd,
  comptrollerAddress: smallMarket.comptrollerAddress,
} as DepositProps;
