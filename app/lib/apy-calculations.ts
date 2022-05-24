import { ethers } from "ethers";
import sampleCTokenAbi from "~/config/sample-ctoken-abi";
import type { Token, cToken, TokenPair } from "~/types/global";
import type { JsonRpcSigner } from "@ethersproject/providers";
import {
  getAssetPriceInUsd,
  getBorrowedAmount,
  getCurrentlySupplying,
  getTotalSupplyBalanceInUsd,
} from "./tender";

function formatApy(apy: number): string {
  return `${apy.toFixed(2).toString()}%`;
}

// https://compound.finance/docs#protocol-math

// Note: this is intentionally a number and not a BigNumber.
// If the ratePerBlock is way lower than the mantissa
// i.e., the rate per block is in the millions and the mantissa is 1e18
// it becomes 0 in the integer division math.
//
// This might be a mistake, but I get the correct APYs based on Compound on Rinkeby.
function calculateApy(decimals: number, ratePerBlock: number): number {
  const blocksPerDay = 6570; // 13.15 seconds per block
  // TODO: this should probably use token.decimals
  const underlyingAssetMantissa = 1e18;

  const supplyRate =
    (ratePerBlock / underlyingAssetMantissa) * blocksPerDay + 1;

  const daysPerYear = 365;

  const apy = (Math.pow(supplyRate, daysPerYear) - 1) * 100;

  return apy;
}

async function calculateDepositApy(
  token: Token,
  cToken: cToken,
  signer: JsonRpcSigner
): Promise<number> {
  // TODO: Use different ABI for cEth and cWBTC
  const cTokenContract = new ethers.Contract(
    cToken.address,
    sampleCTokenAbi,
    signer
  );

  const supplyRatePerBlock = await cTokenContract.supplyRatePerBlock();
  const underlyingAssetMantissa = token.decimals;

  const apy = calculateApy(underlyingAssetMantissa, supplyRatePerBlock);

  return apy;
}

async function calculateBorrowApy(
  token: Token,
  cToken: cToken,
  signer: JsonRpcSigner
): Promise<number> {
  // TODO: Use different ABI for cEth and cWBTC
  const cTokenContract = new ethers.Contract(
    cToken.address,
    sampleCTokenAbi,
    signer
  );

  const borrowRatePerBlock = await cTokenContract.borrowRatePerBlock();
  const underlyingAssetMantissa = token.decimals;

  const apy = calculateApy(underlyingAssetMantissa, borrowRatePerBlock);

  return apy;
}

async function formattedDepositApy(
  token: Token,
  cToken: cToken,
  signer: JsonRpcSigner
): Promise<string> {
  let apy: number = await calculateDepositApy(token, cToken, signer);

  return formatApy(apy);
}

async function formattedBorrowApy(
  token: Token,
  cToken: cToken,
  signer: JsonRpcSigner
): Promise<string> {
  let apy: number = await calculateBorrowApy(token, cToken, signer);

  return formatApy(apy);
}

// TODO: If we passed in the market here we wouldn't have to re-query supply and borrow amounts
async function getNetGainOrLoss(
  s: JsonRpcSigner,
  p: TokenPair
): Promise<number> {
  let supplied: number = await getCurrentlySupplying(s, p.cToken, p.token);
  let supplyApy: number =
    (await calculateDepositApy(p.token, p.cToken, s)) * 0.01;

  let borrowed: number = await getBorrowedAmount(s, p.cToken, p.token);
  let borrowApy: number =
    (await calculateBorrowApy(p.token, p.cToken, s)) * 0.01;

  return (
    supplied * p.token.priceInUsd * supplyApy -
    borrowed * p.token.priceInUsd * borrowApy
  );
}

async function netApy(
  signer: JsonRpcSigner,
  tokenPairs: TokenPair[]
): Promise<number | null> {
  let weightedValues: number[] = await Promise.all(
    tokenPairs.map(async (p): Promise<number> => {
      return await getNetGainOrLoss(signer, p);
    })
  );

  let sum: number = weightedValues.reduce((acc, curr) => acc + curr);

  let totalSupplied: number = await getTotalSupplyBalanceInUsd(
    signer,
    tokenPairs
  );

  // This is a percent value, i.e., if the function returns 0.1 it's 0.1%;
  let result = (sum / totalSupplied) * 100;

  if (Number.isNaN(result)) {
    return null;
  }

  return result;
}

export { formattedDepositApy, formattedBorrowApy, netApy };
