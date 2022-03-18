import SwapRow from "~/components/swap-row";
import {
  SwapRow as SwapRowType,
  TokenName,
  NetworkName,
  Token,
  cToken,
} from "~/types/global";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import networks from "~/config/networks";
import { tokenMetaData } from "~/config/tokenMetaData";

import { formattedDepositApy } from "~/lib/apy-calculations";

// const SUPPORTED_TOKENS = [TokenName.BTC, TokenName.ETH, TokenName.USDT];
const SUPPORTED_TOKENS = [TokenName.DAI];

function generateSwapRows(
  supportedRowTypes: TokenName[],
  networkName: string
): SwapRowType[] {
  return supportedRowTypes.map((tokenName: TokenName): SwapRowType => {
    // Map current conntected network to config data
    let c = networks;
    debugger;
    const networkData = networks[networkName];
    const tokenMetaDatum = tokenMetaData[tokenName];

    let token: Token = networkData.Tokens[tokenMetaDatum.symbol];
    let cToken: cToken = networkData.cTokens[tokenMetaDatum.cTokenSymbol];

    return {
      ...tokenMetaDatum,
      marketSizeUsd: "loading",
      marketSizeNative: "loading",
      totalBorrowedUsd: "loading",
      totalBorrowedNative: "loading",
      depositApy: "loading",
      depositDelta: 1.43,
      borrowApy: "loading",
      borrowApyDelta: 1.43,
      token: token,
      cToken: cToken,
    };
  });
}

export default function SwapTable() {
  let [showUsd, setShowUsd] = useState<boolean>(true);

  const { chainId } = useWeb3React<Web3Provider>();
  const initialRows: SwapRowType[] = generateSwapRows(
    SUPPORTED_TOKENS,
    NetworkName[chainId || 1]
  );

  let [swapRows, setSwapRows] = useState<SwapRowType[]>(initialRows);

  console.log(swapRows);

  useEffect(() => {
    async function fetchBlah(): Promise<SwapRowType[]> {
      return await swapRows.map((swapRow: SwapRowType): SwapRowType => {
        return { ...swapRow, depositApy: "changed" };
      });
    }

    setSwapRows(fetchBlah());
    //   // TODO: This could get slow, need a cached API
    //   let depositApy = await formattedDepositApy(token, cToken);
  });

  return (
    <div className="mb-60">
      <div className="text-center flex">
        <div
          onClick={() => setShowUsd(true)}
          className={clsx("cursor-pointer  text-white py-3 px-6", {
            "bg-brand-green": showUsd,
            "bg-brand-black opacity-50": !showUsd,
          })}
        >
          USD
        </div>
        <div
          onClick={() => setShowUsd(false)}
          className={clsx("cursor-pointer  text-white  py-3 px-6", {
            "bg-brand-green": !showUsd,
            "bg-brand-black opacity-50": showUsd,
          })}
        >
          Native
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl px-10 mt-8">
        {swapRows.map((row) => (
          <SwapRow showUsd={showUsd} key={row.icon} row={row} />
        ))}
      </div>
    </div>
  );
}
