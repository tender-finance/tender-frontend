import type {
  Market,
  Token,
  TokenPair,
  cToken as cTokenType,
} from "~/types/global";
import type { ComponentStory, ComponentMeta } from "@storybook/react";

import Repay, {
  type RepayProps,
} from "../../../../app/components/borrow-flow/repay";

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Tender/ModalFlows/Repay",
  component: Repay,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as ComponentMeta<typeof Repay>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Repay> = (args) => <Repay {...args} />;

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
  setIsRepaying: () => {},
  signer: null,
  borrowLimit: market.borrowLimit,
  borrowedAmount: market.borrowBalance,
  walletBalance: market.walletBalance,
  tokenPairs,
  borrowLimitUsed: market.borrowLimitUsed,
  totalBorrowedAmountInUsd: market.totalBorrowedAmountInUsd,
} as RepayProps;

let smallMarket: Market = {
  id: "000",
  tokenPair,
  marketData: {
    depositApy: "99.99%",
    borrowApy: "0.06%",
    totalBorrowedUsd: "0.01",
    marketSizeUsd: "0.02",
  },
  walletBalance: 0.000001,
  supplyBalance: 0.000002,
  supplyBalanceInUsd: 0.01,
  borrowBalance: 0.02,
  borrowBalanceInUsd: 0.1,
  borrowLimit: 2,
  borrowLimitUsedOfToken: "0.1",
  borrowLimitUsed: "0.2",
  totalBorrowedAmountInUsd: 0.01,
  comptrollerAddress: "0x03",
  maxBorrowLiquidity: 0.8,
};
SmallNumbers.args = {
  market: smallMarket,
  closeModal: () => {},
  setIsRepaying: () => {},
  signer: null,
  borrowLimit: smallMarket.borrowLimit,
  borrowedAmount: smallMarket.borrowBalance,
  walletBalance: smallMarket.walletBalance,
  tokenPairs,
  borrowLimitUsed: smallMarket.borrowLimitUsed,
  totalBorrowedAmountInUsd: smallMarket.totalBorrowedAmountInUsd,
} as RepayProps;
