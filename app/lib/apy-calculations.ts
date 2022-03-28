import { ethers } from "ethers";
import sampleCTokenAbi from "~/config/sample-ctoken-abi";
import { Token, cToken } from "~/types/global";
import { JsonRpcSigner } from "@ethersproject/providers";

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

export { formattedDepositApy, formattedBorrowApy };
