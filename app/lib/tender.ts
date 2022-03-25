import { cToken, SwapRow, SwapRowMarketDatum, Token } from "~/types/global";
import { Signer, ethers } from "ethers";

import SampleCTokenAbi from "~/config/sample-ctoken-abi";
import SampleErc20Abi from "~/config/sample-erc20-abi";
import SampleComptrollerAbi from "~/config/sample-comptroller-abi";

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
  let approvalVal = "1000000000000000000";
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
  let address = await signer.getAddress();
  let balance = await contract.balanceOf(address);
  return balance.toString();
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
async function deposit(value: string, signer: Signer, cToken: cToken) {
  // if (isCEth) {
  //   console.log("supply() w/ cEth");

  //   const formattedValue = ethers.utils.parseEther(value);
  //   console.log("input value:", value, "formattedValue:", formattedValue.toString());

  //   let contract = new ethers.Contract(address, sampleAbi, web3React.library?.getSigner());
  //   let tx = await contract.mint({ value: ethers.utils.parseEther(value) });
  // }
  // else {
  console.log("supply() with cToken", cToken.name, cToken.address);

  const formattedValue = ethers.BigNumber.from(value);
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
async function redeem(value: string, signer: Signer, cToken: cToken) {
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
  console.log("redeem() with cToken", name, "address:", cToken.address);

  const formattedValue = ethers.utils.parseEther(value);
  console.log("input value:", value, "formattedValue:", formattedValue);

  let contract = new ethers.Contract(cToken.address, SampleCTokenAbi, signer);
  let tx = await contract.redeem(formattedValue);
  // }
}

/**
 *
 * @param signer
 * @param cToken
 * @returns
 */
async function getCurrentlySupplying(
  signer: Signer,
  cToken: cToken
): Promise<string> {
  let contract = new ethers.Contract(cToken.address, SampleCTokenAbi, signer);
  let address = await signer.getAddress();
  let balance = await contract.balanceOf(address);
  return balance.toString();
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
  cToken: cToken
): Promise<number> {
  let comptrollerContract = new ethers.Contract(
    comptrollerAddress,
    SampleComptrollerAbi,
    signer
  );
  let { 1: collateralFactor } = await comptrollerContract.markets(
    cToken.address
  );
  collateralFactor = (collateralFactor / 1e18) * 100;

  let address = await signer.getAddress();
  let { 1: liquidity } = await comptrollerContract.getAccountLiquidity(address);
  liquidity = liquidity / 1e18;

  return collateralFactor * liquidity;
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
  borrowedAmount: number,
  borrowedLimit: number
): Promise<number> {
  return Math.round((borrowedAmount / borrowedLimit) * 100);
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
async function repay(value: string, signer: Signer, cToken: cToken) {
  const formattedValue = value;
  let contract = new ethers.Contract(cToken.address, SampleCTokenAbi, signer);
  await contract.repayBorrow(formattedValue);
}

/**
 *
 * @param value
 * @param signer
 * @param cToken
 */
async function borrow(value: string, signer: Signer, cToken: cToken) {
  //  if (isCEth) {
  //   console.log("borrow() with cEth");

  //   const formattedValue = ethers.utils.parseEther(value);
  //   console.log("input value:", value, "formattedValue:", formattedValue);

  //   let contract = new ethers.Contract(address, sampleAbi, web3React.library?.getSigner());
  //   let tx = await contract.borrow(formattedValue);
  // }
  // else {

  const formattedValue = value;
  let contract = new ethers.Contract(cToken.address, SampleCTokenAbi, signer);
  let tx = await contract.borrow(formattedValue);
  // }
}

export {
  enable,
  deposit,
  redeem,
  getWalletBalance,
  getCurrentlySupplying,
  getBorrowLimit,
  getBorrowedAmount,
  getBorrowLimitUsed,
  repay,
  borrow,
};
