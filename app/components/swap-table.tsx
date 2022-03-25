import SwapRow from "~/components/swap-row";
import {
  SwapRow as SwapRowType,
  TokenName,
  NetworkName,
  Token,
  cToken,
  SwapRowMarketData,
  SwapRowMarketDatum,
  NetworkData,
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

import { getMarketSizeUsd, getTotalBorrowedUsd } from "~/lib/tender";

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
    const networkData: NetworkData = networks[networkName];
    const tokenMetaDatum = tokenMetaData[tokenName];

    let token: Token = networkData.Tokens[tokenMetaDatum.symbol];
    let cToken: cToken = networkData.cTokens[tokenMetaDatum.cTokenSymbol];
    let comptrollerAddress: string = networkData.Contracts.Comptroller;

    return {
      ...tokenMetaDatum,
      comptrollerAddress: comptrollerAddress,
      token: token,
      cToken: cToken,
    };
  });
}

async function loadMarketData(
  signer: JsonRpcSigner,
  swapRows: SwapRowType[]
): Promise<SwapRowMarketData> {
  try {
    let marketData: SwapRowMarketDatum[] = await Promise.all(
      swapRows.map(async (s: SwapRowType): Promise<SwapRowMarketDatum> => {
        // TODO: This could get slow, need a cached API
        const marketSizeUsd: string = await getMarketSizeUsd(signer, s.cToken);
        const totalBorrowedUsd: string = await getTotalBorrowedUsd(
          signer,
          s.cToken
        );
        const depositApy: string = await formattedDepositApy(
          s.token,
          s.cToken,
          signer
        );
        const borrowApy: string = await formattedBorrowApy(
          s.token,
          s.cToken,
          signer
        );
        return {
          id: s.name,
          marketSizeUsd,
          marketSizeNative: "~",
          totalBorrowedUsd,
          totalBorrowedNative: "~",
          depositApy,
          borrowApy,
        };
      })
    );
    let swapRowMarketData: SwapRowMarketData = {};
    marketData.forEach((md) => (swapRowMarketData[md.id] = { ...md }));
    return swapRowMarketData;
  } catch (error) {
    console.error(error);
    return {};
  }
}

export default function SwapTable() {
  let [showUsd, setShowUsd] = useState<boolean>(true);
  let [swapRows, setSwapRows] = useState<SwapRowType[]>([]);
  let [swapRowsMarketData, setSwapRowsMarketData] = useState<SwapRowMarketData>(
    {}
  );

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
  }, [library, chainId]);

  useEffect(() => {
    if (!library) {
      return;
    }
    loadMarketData(library.getSigner(), swapRows).then((f) =>
      setSwapRowsMarketData(f)
    );
  }, [swapRows]);

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
          <div className=" flex align-middle items-center  font-light text-gray-300 px-10">
            <div className="flex items-center align-middle">
              <div style={{ width: "55px" }} className="mr-4"></div>
              <div style={{ width: "250px" }}></div>
            </div>
            <div className="grid grid-cols-4 flex-grow text-xs text-gray-500 text-center">
              <div>Market size </div>
              <div>Total borrowed </div>
              <div>Deposit APY</div>
              <div>Borrow APY</div>
            </div>
            <div style={{ width: "280px" }}></div>
          </div>

          <div className="bg-gray-800 rounded-xl px-10 mt-8">
            {swapRows.map((row) => (
              <SwapRow
                showUsd={showUsd}
                key={row.icon}
                row={row}
                marketData={swapRowsMarketData[row.name] || {}}
              />
            ))}
          </div>
        </>
      )}
      {!chainId && <ConnectWallet />}
    </div>
  );
}
