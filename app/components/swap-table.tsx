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
import { JsonRpcSigner, Web3Provider } from "@ethersproject/providers";

import networks from "~/config/networks";
import { tokenMetaData } from "~/config/tokenMetaData";

import {
  formattedBorrowApy,
  formattedDepositApy,
} from "~/lib/apy-calculations";
import ConnectWallet from "./connect-wallet";

// const SUPPORTED_TOKENS = [TokenName.BTC, TokenName.ETH, TokenName.USDT];
const SUPPORTED_TOKENS = [TokenName.DAI];

function generateSwapRows(
  supportedRowTypes: TokenName[],
  networkName: string
): SwapRowType[] {
  return supportedRowTypes.map((tokenName: TokenName): SwapRowType => {
    // Map current conntected network to config data
    // @ts-ignore
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
  let [swapRows, setSwapRows] = useState<SwapRowType[]>([]);

  const { chainId, library } = useWeb3React<Web3Provider>();

  useEffect(() => {
    if (!chainId) {
      return;
    }

    const rows: SwapRowType[] = generateSwapRows(
      SUPPORTED_TOKENS,
      NetworkName[chainId]
    );

    setSwapRows(rows);

    // async function loadFi() {
    //   console.log("loadFi");
    //   if (!library) {
    //     console.log("No library");
    //     return;
    //   }
    //   // TODO: Need to use Alchemy to always have a connection
    //   if (!library?.getSigner()) {
    //     console.error("Error: no provider");
    //     return;
    //   }
    //   const signer: JsonRpcSigner = library?.getSigner();
    //   try {
    //     let newSwapRows = await Promise.all(
    //       swapRows.map(async (s: SwapRowType): Promise<SwapRowType> => {
    //         // TODO: This could get slow, need a cached API
    //         const depositApy: string = await formattedDepositApy(
    //           s.token,
    //           s.cToken,
    //           signer
    //         );
    //         const borrowApy: string = await formattedBorrowApy(
    //           s.token,
    //           s.cToken,
    //           signer
    //         );
    //         return {
    //           ...s,
    //           depositApy,
    //           borrowApy,
    //         };
    //       })
    //     );
    //     setSwapRows(newSwapRows);
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }
    // loadFi();
    // TODO something here
  }, [library, chainId]);

  return (
    <div className="mb-60">
      {chainId && (
        <>
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
        </>
      )}
      {!chainId && <ConnectWallet />}
    </div>
  );
}
