import type { cToken, Token } from "~/types/global";
import type { Signer, Contract } from "ethers";
import { ethers, BigNumber } from "ethers";

import SampleCTokenAbi from "~/config/sample-ctoken-abi";
import SampleErc20Abi from "~/config/sample-erc20-abi";
import SampleComptrollerAbi from "~/config/sample-comptroller-abi";
import SamplePriceOracleAbi from "~/config/sample-price-oracle-abi";

import type { TokenPair } from "~/types/global";
import { formatUnits } from "ethers/lib/utils";
import type {
  TransactionReceipt,
  JsonRpcSigner,
} from "@ethersproject/providers";

const MINIMUM_REQUIRED_APPROVAL_BALANCE = BigNumber.from("1");

function formatBigNumber(value: BigNumber, decimals: number): number {
  // formatUnits returns a string with the decimals in the appropriate place,
  // and it needs to be made a float.
  // toFixed(2) rounds the float to two decimals, and returns a string,
  // so we need to make it a float again. :(
  return parseFloat(parseFloat(formatUnits(value, decimals)).toFixed(2));
}

/**
 * Enable
 *
 * @param signer E
 * @param token
 * @param cToken
 */
async function enable(
  signer: Signer,
  token: Token,
  cToken: cToken
): Promise<void> {
  // const isCEth = token.address ? false : true;
  // if (isCEth) {
  //   throw "Don't need to approve ETH";
  // }

  // @ts-ignore
  let contract = new ethers.Contract(token.address, SampleErc20Abi, signer);
  let approvalVal = BigNumber.from(2).pow(256).sub(1).toString(); // Max approval value, 2^256 - 1
  await contract.approve(cToken.address, approvalVal);
}

/**
 *
 * @param signer
 * @param token
 * @returns
 */
async function getWalletBalance(signer: Signer, token: Token): Promise<number> {
  let contract = new ethers.Contract(token.address, SampleErc20Abi, signer);
  let address: string = await signer.getAddress();
  let balance: BigNumber = await contract.balanceOf(address);

  return formatBigNumber(balance, token.decimals);
}

/**
 * -------------------------------
 * Depost Flow
 * -------------------------------
 */

/**
 * Deposit
 *
 * @param value
 * @param signer
 * @param cToken
 */
async function deposit(
  value: string,
  signer: Signer,
  cToken: cToken,
  token: Token
): Promise<{
  wait: () => TransactionReceipt;
}> {
  // if (isCEth) {
  //   console.log("supply() w/ cEth");

  //   const formattedValue = ethers.utils.parseEther(value);
  //   console.log("input value:", value, "formattedValue:", formattedValue.toString());

  //   let contract = new ethers.Contract(address, sampleAbi, web3React.library?.getSigner());
  //   let tx = await contract.mint({ value: ethers.utils.parseEther(value) });
  // }
  // else {
  console.log("supply() with cToken", cToken.symbol, cToken.address);

  const formattedValue = ethers.utils.parseUnits(value, token.decimals);
  console.log(
    "input value:",
    value,
    "formattedValue:",
    formattedValue.toString()
  );

  let contract = new ethers.Contract(cToken.address, SampleCTokenAbi, signer);
  return await contract.mint(formattedValue);
  // }
}

/**
 *
 * @param value
 * @param signer
 * @param cToken
 */
async function redeem(
  value: string,
  signer: Signer,
  cToken: cToken,
  token: Token
): Promise<{
  wait: () => TransactionReceipt;
}> {
  // if (isCEth) {
  //   console.log("redeem() with cEth");

  //   const formattedValue = ethers.utils.parseEther(value);
  //   console.log("input value:", value, "formattedValue:", formattedValue);

  //   let contract = new ethers.Contract(
  //     address,
  //     sampleAbi,
  //     web3React.library?.getSigner()
  //   );
  //   let tx = await contract.redeemUnderlying(formattedValue);
  // } else {
  const formattedValue = ethers.utils.parseUnits(value, token.decimals);

  let cTokenContract = new ethers.Contract(
    cToken.address,
    SampleCTokenAbi,
    signer
  );
  return await cTokenContract.redeemUnderlying(formattedValue);
  // }
}

// TODO: Is this a USD amount or a token amount? We've been using DAI as the example so it's basically 1:1,
// but for things like ether this likely won't work and need to separate supplying vs USD value of supplying
/**
 *
 * @param signer
 * @param cToken
 * @returns
 */
async function getCurrentlySupplying(
  signer: Signer,
  cToken: cToken,
  token: Token
): Promise<number> {
  let contract = new ethers.Contract(cToken.address, SampleCTokenAbi, signer);
  let address = await signer.getAddress();

  const balance: BigNumber = await contract.callStatic.balanceOfUnderlying(
    address
  );

  return formatBigNumber(balance, token.decimals);
}

/**
 *
 * @param signer
 * @param cToken
 * @returns string
 */
// TODO: this and getBorrowedAmount are basically the same, minus formatting.
async function getCurrentlyBorrowing(
  signer: Signer,
  cToken: cToken,
  token: Token
): Promise<number> {
  let contract: Contract = new ethers.Contract(
    cToken.address,
    SampleCTokenAbi,
    signer
  );
  let address: string = await signer.getAddress();
  let balance: BigNumber = await contract.borrowBalanceStored(address);

  return formatBigNumber(balance, token.decimals);
}

async function collateralFactorForToken(
  signer: Signer,
  comptrollerContract: Contract,
  tokenPair: TokenPair
): Promise<number> {
  let { 1: rawCollateralFactor } = await comptrollerContract.markets(
    tokenPair.cToken.address
  );

  // Collateral factors are always 1e18
  let collateralFactor: number = parseFloat(
    formatUnits(rawCollateralFactor, 18)
  );

  return collateralFactor;
}

async function borrowLimitForTokenInUsd(
  signer: Signer,
  comptrollerContract: Contract,
  tokenPair: TokenPair
): Promise<number> {
  let suppliedAmount: number = await getCurrentlySupplying(
    signer,
    tokenPair.cToken,
    tokenPair.token
  );

  let assetPriceInUsd = await getAssetPriceInUsd(
    signer,
    tokenPair.token.priceOracleAddress
  );

  let collateralFactor: number = await collateralFactorForToken(
    signer,
    comptrollerContract,
    tokenPair
  );

  let amount = suppliedAmount * assetPriceInUsd * collateralFactor;

  return parseFloat(amount.toFixed(2));
}

/**
 *
 * @param signer
 * @param comptrollerAddress
 * @param cToken
 * @returns
 *
 * Each token has a max amount you can borrow against it.
 * For example, DAI on Rinkeby has a 70% collateral factor, so you can borrow up to 70% of your supplied DAI.
 *
 * Summing all tokens you have supplied multiplied by their collateral limits gives the borrow limit.
 */
async function getAccountBorrowLimitInUsd(
  signer: Signer,
  comptrollerAddress: string,
  tokenPairs: TokenPair[]
): Promise<number> {
  let comptrollerContract = new ethers.Contract(
    comptrollerAddress,
    SampleComptrollerAbi,
    signer
  );

  let tokenBalancesInUsd = await Promise.all(
    tokenPairs.map(async (tokenPair: TokenPair): Promise<number> => {
      return borrowLimitForTokenInUsd(signer, comptrollerContract, tokenPair);
    })
  );

  let borrowLimit = tokenBalancesInUsd.reduce((acc, curr) => acc + curr);

  return borrowLimit;
}

async function projectBorrowLimit(
  signer: Signer,
  comptrollerAddress: string,
  tokenPairs: TokenPair[],
  tokenPair: TokenPair,
  tokenAmount: number
): Promise<number> {
  let currentBorrowLimitInUsd = await getAccountBorrowLimitInUsd(
    signer,
    comptrollerAddress,
    tokenPairs
  );

  let comptrollerContract = new ethers.Contract(
    comptrollerAddress,
    SampleComptrollerAbi,
    signer
  );

  let collateralFactor: number = await collateralFactorForToken(
    signer,
    comptrollerContract,
    tokenPair
  );

  let priceInUsd = await getAssetPriceInUsd(
    signer,
    tokenPair.token.priceOracleAddress
  );

  // Borrow limit changes by the dollar amount of this amount of tokens
  // times its collateral factor (what % of that dollar amount you can borrow against).
  // `tokenAmount` might be a negative number and thus reduce the limit.
  let borrowLimitChangeInUsd: number =
    tokenAmount * priceInUsd * collateralFactor;

  return currentBorrowLimitInUsd + borrowLimitChangeInUsd;
}

/**
 *
 * @param signer
 * @param cToken
 * @returns
 */
// TODO: this and getCurrentlyBorrowing are basically the same, minus formatting.
async function getBorrowedAmount(
  signer: Signer,
  cToken: cToken,
  token: Token
): Promise<number> {
  let contract = new ethers.Contract(cToken.address, SampleCTokenAbi, signer);
  let address = await signer.getAddress();
  let borrowedAmount: BigNumber = await contract.borrowBalanceStored(address);

  let borrowed: number = parseFloat(
    ethers.utils.formatUnits(borrowedAmount, token.decimals)
  );

  return borrowed;
}

/**
 *
 * @param borrowedAmount
 * @param borrowedLimit
 * @returns
 */
async function getBorrowLimitUsed(
  borrowedAmount: number,
  borrowedLimit: number
): Promise<string> {
  return ((borrowedAmount / borrowedLimit) * 100).toFixed(2);
}

/**
 * -------------------------------
 * Withdraw Flow
 * -------------------------------
 */

/**
 *
 * @param value
 * @param signer
 * @param cToken
 */
async function repay(
  value: string,
  signer: Signer,
  cToken: cToken,
  token: Token
): Promise<{
  wait: () => TransactionReceipt;
}> {
  const formattedValue: BigNumber = ethers.utils.parseUnits(
    value,
    token.decimals
  );
  let contract = new ethers.Contract(cToken.address, SampleCTokenAbi, signer);
  return await contract.repayBorrow(formattedValue);
}

/**
 *
 * @param value
 * @param signer
 * @param cToken
 */
async function borrow(
  value: string,
  signer: Signer,
  cToken: cToken,
  token: Token
): Promise<{
  wait: () => TransactionReceipt;
}> {
  //  if (isCEth) {
  //   console.log("borrow() with cEth");

  //   const formattedValue = ethers.utils.parseEther(value);
  //   console.log("input value:", value, "formattedValue:", formattedValue);

  //   let contract = new ethers.Contract(address, sampleAbi, web3React.library?.getSigner());
  //   let tx = await contract.borrow(formattedValue);
  // }
  // else {

  const formattedValue: BigNumber = ethers.utils.parseUnits(
    value,
    token.decimals
  );
  let contract = new ethers.Contract(cToken.address, SampleCTokenAbi, signer);
  return await contract.borrow(formattedValue);
  // }
}

async function getMarketSizeUsd(
  signer: Signer,
  cToken: cToken
): Promise<string> {
  let contract = new ethers.Contract(cToken.address, SampleCTokenAbi, signer);
  let value = await contract.totalSupply();

  // TODO: better formatting here, test net number is super big. This should probably initially be millions?
  return `${value.toString().slice(0, 3)}M`;
}

async function getTotalBorrowedUsd(
  signer: Signer,
  cToken: cToken
): Promise<string> {
  let contract = new ethers.Contract(cToken.address, SampleCTokenAbi, signer);
  let value = await contract.totalBorrows();

  // TODO: better formatting here, test net number is super big. This should probably initially be millions?
  return `${value.toString().slice(0, 3)}M`;
}

async function hasSufficientAllowance(
  signer: Signer,
  token: Token,
  cToken: cToken
): Promise<boolean> {
  let contract = new ethers.Contract(token.address, SampleErc20Abi, signer);
  let address = await signer.getAddress();
  let allowance: BigNumber = await contract.allowance(address, cToken.address);

  return allowance.gte(MINIMUM_REQUIRED_APPROVAL_BALANCE);
}

async function getAssetPriceInUsd(
  signer: Signer,
  priceOracleAddress: string
): Promise<number> {
  // let contract = new ethers.Contract(
  //   priceOracleAddress,
  //   SamplePriceOracleAbi,
  //   signer
  // );

  // let decimals = await contract.decimals();
  // let { answer }: { answer: BigNumber } = await contract.latestRoundData();

  // let priceInUsd = parseFloat(formatUnits(answer, decimals));

  // return priceInUsd;
  // TODO add metis price oracle
    return 2.5;
}

async function getTotalSupplyBalanceInUsd(
  signer: Signer,
  tokenPairs: TokenPair[]
): Promise<number> {
  let suppliedAmounts = await Promise.all(
    tokenPairs.map(async (tp: TokenPair): Promise<number> => {
      let suppliedAmount: number = await getCurrentlySupplying(
        signer,
        tp.cToken,
        tp.token
      );

      let priceInUsd = await getAssetPriceInUsd(
        signer,
        tp.token.priceOracleAddress
      );

      return suppliedAmount * priceInUsd;
    })
  );

  return suppliedAmounts.reduce((acc, curr) => acc + curr);
}

async function getTotalBorrowedInUsd(
  signer: Signer,
  tokenPairs: TokenPair[]
): Promise<number> {
  let borrowedAmounts = await Promise.all(
    tokenPairs.map(async (tp: TokenPair): Promise<number> => {
      let borrowedAmount: number = await getCurrentlyBorrowing(
        signer,
        tp.cToken,
        tp.token
      );

      let priceInUsd = await getAssetPriceInUsd(
        signer,
        tp.token.priceOracleAddress
      );

      return borrowedAmount * priceInUsd;
    })
  );

  return borrowedAmounts.reduce((acc, curr) => acc + curr);
}

function accountLiquidityInUsd(
  borrowLimitInUsd: number,
  totalBorrowedInUsd: number
): number {
  return borrowLimitInUsd - totalBorrowedInUsd;
}

async function maxWithdrawAmountForToken(
  signer: JsonRpcSigner,
  borrowLimit: number,
  totalBorrowed: number,
  comptrollerAddress: string,
  tokenPair: TokenPair
): Promise<number> {
  let accountLiquidity: number = accountLiquidityInUsd(
    borrowLimit,
    totalBorrowed
  );

  let comptrollerContract = new ethers.Contract(
    comptrollerAddress,
    SampleComptrollerAbi,
    signer
  );

  let collateralFactor: number = await collateralFactorForToken(
    signer,
    comptrollerContract,
    tokenPair
  );

  let priceInUsd: number = await getAssetPriceInUsd(
    signer,
    tokenPair.token.priceOracleAddress
  );

  return (accountLiquidity / collateralFactor) * priceInUsd;
}

async function maxBorrowAmountForToken(
  signer: Signer,
  borrowLimit: number,
  totalBorrowed: number,
  tokenPair: TokenPair
): Promise<number> {
  let accountLiquidity: number = accountLiquidityInUsd(
    borrowLimit,
    totalBorrowed
  );
  let priceInUsd: number = await getAssetPriceInUsd(
    signer,
    tokenPair.token.priceOracleAddress
  );

  return accountLiquidity / priceInUsd;
}

export {
  enable,
  deposit,
  redeem,
  getWalletBalance,
  getCurrentlySupplying,
  getCurrentlyBorrowing,
  getAccountBorrowLimitInUsd,
  getBorrowedAmount,
  getBorrowLimitUsed,
  getTotalSupplyBalanceInUsd,
  repay,
  borrow,
  getMarketSizeUsd,
  getTotalBorrowedUsd,
  hasSufficientAllowance,
  projectBorrowLimit,
  getAssetPriceInUsd,
  getTotalBorrowedInUsd,
  maxWithdrawAmountForToken,
  maxBorrowAmountForToken,
};
