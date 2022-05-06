import { useState, useEffect } from "react";
import type { Market, TokenName, TokenPair } from "~/types/global";
import { tokenMetaData } from "~/config/tokenMetaData";
import type { JsonRpcSigner } from "@ethersproject/providers";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";
import { useWeb3Signer } from "~/hooks/use-web3-signer";
import {
  formattedBorrowApy,
  formattedDepositApy,
} from "~/lib/apy-calculations";
import {
  getBorrowLimit,
  getBorrowLimitUsed,
  getCurrentlyBorrowing,
  getCurrentlySupplying,
  getMarketSizeUsd,
  getTotalBorrowed,
  getTotalBorrowedUsd,
  getWalletBalance,
} from "~/lib/tender";

const getMarketData = async (
  signer: JsonRpcSigner,
  tp: TokenPair
): Promise<Market["marketData"]> => {
  const depositApy: string = await formattedDepositApy(
    tp.token,
    tp.cToken,
    signer
  );
  const borrowApy: string = await formattedBorrowApy(
    tp.token,
    tp.cToken,
    signer
  );

  let totalBorrowedUsd = await getTotalBorrowedUsd(signer, tp.cToken);
  let marketSizeUsd = await getMarketSizeUsd(signer, tp.cToken);

  return {
    depositApy,
    borrowApy,
    totalBorrowedUsd,
    marketSizeUsd,
  };
};

export function useMarkets(
  supportedTokenPairs: TokenPair[],
  comptrollerAddress: string | undefined
) {
  let [markets, setMarkets] = useState<Market[]>([]);

  let provider = Web3Hooks.useProvider();
  const signer = useWeb3Signer(provider);

  useEffect(() => {
    if (!signer || !comptrollerAddress) {
      return;
    }

    let newMarkets = supportedTokenPairs.map(async (tp): Promise<Market> => {
      // TODO: optimize with parallelization
      let totalBorrowedAmount = await getTotalBorrowed(
        signer,
        supportedTokenPairs
      );
      let borrowLimit = await getBorrowLimit(
        signer,
        comptrollerAddress,
        supportedTokenPairs
      );

      return {
        id: tp.token.symbol,
        tokenPair: tp,
        tokenMetaData: tokenMetaData[tp.token.symbol as TokenName],
        marketData: await getMarketData(signer, tp),
        walletBalance: await getWalletBalance(signer, tp.token),
        supplyBalance: await getCurrentlySupplying(signer, tp.cToken, tp.token),
        borrowBalance: await getCurrentlyBorrowing(signer, tp.cToken, tp.token),
        comptrollerAddress,
        borrowLimit,
        totalBorrowedAmount,
        borrowLimitUsed: await getBorrowLimitUsed(
          totalBorrowedAmount,
          borrowLimit
        ),
      };
    });

    Promise.all(newMarkets).then((nm) => setMarkets(nm));
  }, [supportedTokenPairs, signer, comptrollerAddress]);

  return markets;
}
