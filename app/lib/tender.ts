import { cToken, Token } from "~/types/global";
import { Signer, ethers, BigNumber, Contract } from "ethers";

import SampleCTokenAbi from "~/config/sample-ctoken-abi";
import SampleErc20Abi from "~/config/sample-erc20-abi";
import SampleComptrollerAbi from "~/config/sample-comptroller-abi";

import { TokenPair } from "~/types/global";

const MINIMUM_REQUIRED_APPROVAL_BALANCE = BigNumber.from("1");

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
  let approvalTx = await contract.approve(cToken.address, approvalVal);
}

/**
 *
 * @param signer
 * @param token
 * @returns
 */
async function getWalletBalance(signer: Signer, token: Token): Promise<string> {
  let contract = new ethers.Contract(token.address, SampleErc20Abi, signer);
  let address: string = await signer.getAddress();
  let balance: BigNumber = await contract.balanceOf(address);
  let mantissa = ethers.utils.parseUnits("1", token.decimals);

  return balance.div(mantissa).toNumber().toFixed(2).toString();
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
) {
  // if (isCEth) {
  //   console.log("supply() w/ cEth");

  //   const formattedValue = ethers.utils.parseEther(value);
  //   console.log("input value:", value, "formattedValue:", formattedValue.toString());

  //   let contract = new ethers.Contract(address, sampleAbi, web3React.library?.getSigner());
  //   let tx = await contract.mint({ value: ethers.utils.parseEther(value) });
  // }
  // else {
  console.log("supply() with cToken", cToken.name, cToken.address);

  const formattedValue = ethers.utils.parseUnits(value, token.decimals);
  console.log(
    "input value:",
    value,
    "formattedValue:",
    formattedValue.toString()
  );

  let contract = new ethers.Contract(cToken.address, SampleCTokenAbi, signer);
  let tx = await contract.mint(formattedValue);
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
) {
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
  let tx = await cTokenContract.redeemUnderlying(formattedValue);
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
): Promise<string> {
  let contract = new ethers.Contract(cToken.address, SampleCTokenAbi, signer);
  let address = await signer.getAddress();

  const rawBalance = await contract.callStatic.balanceOfUnderlying(address);
  const balance: BigNumber = rawBalance;
  const mantissa = ethers.utils.parseUnits("1", token.decimals);

  const val = balance.div(mantissa).toString();

  return val;
}

/**
 *
 * @param signer
 * @param cToken
 * @returns string
 */
async function getCurrentlyBorrowing(
  signer: Signer,
  cToken: cToken,
  token: Token
): Promise<BigNumber> {
  let contract: Contract = new ethers.Contract(
    cToken.address,
    SampleCTokenAbi,
    signer
  );
  let address: string = await signer.getAddress();
  let balance: BigNumber = await contract.borrowBalanceStored(address);
  let mantissa: BigNumber = ethers.utils.parseUnits("1", token.decimals);

  return balance.div(mantissa);
}

// TODO: This function should take into account which markets we've entered
// as collateral. By default for now I believe the product spec says we want
// to automatically enter markets upon depositing.
async function availableCollateralToBorrowAgainst(
  signer: Signer,
  comptrollerContract: Contract,
  tokenPair: TokenPair
): Promise<number> {
  let suppliedAmount: BigNumber = BigNumber.from(
    await getCurrentlySupplying(signer, tokenPair.cToken, tokenPair.token)
  );

  let { 1: rawCollateralFactor } = await comptrollerContract.markets(
    tokenPair.cToken.address
  );
  let collateralFactor: BigNumber = rawCollateralFactor;

  // Collateral factors are always 1e18
  let mantissa = ethers.utils.parseUnits("1", 18);

  // collateralFactor represents the % you can borrow against your asset,
  // when scaled down by the mantissa it represents a number like 0.7 or 0.8, i.e., 70% or 80%.
  // collateralFactor is only 17 digits, and most tokens are 18 digits.
  // This makes dividing by 1e18 always 0, so by inflating by 100 and dividing by 100
  // we can stay using BigNumbers as long as possible.
  //
  // TODO: Do this same thing division workaround in the APY calculations?
  let amount =
    suppliedAmount.mul(100).mul(collateralFactor).div(mantissa).toNumber() /
    100;

  return amount;
}

/**
 *
 * @param signer
 * @param comptrollerAddress
 * @param cToken
 * @returns
 */
async function getBorrowLimit(
  signer: Signer,
  comptrollerAddress: string,
  tokenPairs: TokenPair[]
): Promise<number> {
  let comptrollerContract = new ethers.Contract(
    comptrollerAddress,
    SampleComptrollerAbi,
    signer
  );

  let tokenBalances = await Promise.all(
    tokenPairs.map(async (tokenPair: TokenPair): Promise<number> => {
      return availableCollateralToBorrowAgainst(
        signer,
        comptrollerContract,
        tokenPair
      );
    })
  );

  let borrowLimit = tokenBalances.reduce(
    (acc: number, curr: number): number => acc + curr
  );

  return borrowLimit;
}

/**
 *
 * @param signer
 * @param cToken
 * @returns
 */
async function getBorrowedAmount(
  signer: Signer,
  cToken: cToken
): Promise<number> {
  let contract = new ethers.Contract(cToken.address, SampleCTokenAbi, signer);
  let address = await signer.getAddress();
  let borrowedAmount: number = await contract.borrowBalanceStored(address);
  return borrowedAmount;
}

/**
 *
 * @param borrowedAmount
 * @param borrowedLimit
 * @returns
 */
async function getBorrowLimitUsed(
  totalBorrowed: BigNumber,
  borrowedLimit: number
): Promise<string> {
  return ((totalBorrowed.toNumber() / borrowedLimit) * 100).toFixed(2);
}

async function getTotalBorrowed(
  signer: Signer,
  tokenPairs: TokenPair[]
): Promise<BigNumber> {
  let borrowedAmounts = await Promise.all(
    tokenPairs.map(async (tokenPair: TokenPair): Promise<BigNumber> => {
      let borrowedAmount: BigNumber = BigNumber.from(
        await getCurrentlyBorrowing(signer, tokenPair.cToken, tokenPair.token)
      );

      return borrowedAmount;
    })
  );

  let totalBorrowed = borrowedAmounts.reduce(
    (acc: BigNumber, curr: BigNumber): BigNumber => {
      return acc.add(curr);
    },
    BigNumber.from(0)
  );

  return totalBorrowed;
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
) {
  const formattedValue: BigNumber = ethers.utils.parseUnits(
    value,
    token.decimals
  );
  let contract = new ethers.Contract(cToken.address, SampleCTokenAbi, signer);
  await contract.repayBorrow(formattedValue);
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
) {
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
  let tx = await contract.borrow(formattedValue);
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

export {
  enable,
  deposit,
  redeem,
  getWalletBalance,
  getCurrentlySupplying,
  getCurrentlyBorrowing,
  getBorrowLimit,
  getBorrowedAmount,
  getBorrowLimitUsed,
  repay,
  borrow,
  getMarketSizeUsd,
  getTotalBorrowedUsd,
  hasSufficientAllowance,
  getTotalBorrowed,
};
