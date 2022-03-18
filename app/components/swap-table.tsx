import SwapRow from "~/components/swap-row";
import { SwapRow as SwapRowType, TokenName, NetworkName } from "~/types/global";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

import networks from "~/config/networks";
import { tokenMetaData } from "~/config/tokenMetaData";

// const SUPPORTED_TOKENS = [TokenName.BTC, TokenName.ETH, TokenName.USDT];
const SUPPORTED_TOKENS = [TokenName.USDT];

function generateSwapRows(
  supportedRowTypes: TokenName[],
  networkName: string
): SwapRowType[] {
  return supportedRowTypes.map((tokenName: TokenName): SwapRowType => {
    // Map current conntected network to config data
    const networkData = networks[networkName];
    const tokenMetaDatum = tokenMetaData[tokenName];

    return {
      ...tokenMetaDatum,
      marketSizeUsd: "$1.87B",
      marketSizeNative: "3ETH",
      totalBorrowedUsd: "$1.39B",
      totalBorrowedNative: "3ETH",
      depositApy: "2.80%",
      depositDelta: 1.43,
      borrowApy: "3.98%",
      borrowApyDelta: 1.43,
      token: networkData.Tokens[tokenMetaDatum.symbol],
      cToken: networkData.cTokens[tokenMetaDatum.cTokenSymbol],
    };
  });
}

export default function SwapTable() {
  let [showUsd, setShowUsd] = useState<boolean>(true);

  const { chainId } = useWeb3React<Web3Provider>();

  const swapRows: SwapRowType[] = generateSwapRows(
    SUPPORTED_TOKENS,
    NetworkName[chainId || 1]
  );

  console.log(swapRows);

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
