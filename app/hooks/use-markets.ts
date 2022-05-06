import { useState, useEffect } from "react";
import type { Market, NetworkData, TokenName, TokenPair } from "~/types/global";
import { tokenMetaData } from "~/config/tokenMetaData";
import type { JsonRpcSigner } from "@ethersproject/providers";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";
import { useWeb3Signer } from "~/hooks/use-web3-signer";
import {
  formattedBorrowApy,
  formattedDepositApy,
} from "~/lib/apy-calculations";
import {
  borrow,
  getAssetPriceInUsd,
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

  // TODO: don't think we're using these two fields
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
  comptrollerAddress: string | undefined,
  priceOracles: NetworkData["PriceOracles"] | undefined
) {
  let [markets, setMarkets] = useState<Market[]>([]);

  let provider = Web3Hooks.useProvider();
  const signer = useWeb3Signer(provider);

  useEffect(() => {
    if (!signer || !comptrollerAddress || !priceOracles) {
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

      let priceOracleAddress: string = priceOracles[tp.token.symbol];
      let assetPriceInUsd: number = await getAssetPriceInUsd(
        signer,
        priceOracleAddress
      );

      let supplyBalance = await getCurrentlySupplying(
        signer,
        tp.cToken,
        tp.token
      );

      let borrowBalance = await getCurrentlyBorrowing(
        signer,
        tp.cToken,
        tp.token
      );

      let supplyBalanceInUsd = supplyBalance * assetPriceInUsd;
      let borrowBalanceInUsd = borrowBalance * assetPriceInUsd;

      return {
        id: tp.token.symbol,
        tokenPair: tp,
        tokenMetaData: tokenMetaData[tp.token.symbol as TokenName],
        marketData: await getMarketData(signer, tp),
        walletBalance: await getWalletBalance(signer, tp.token),
        supplyBalance,
        supplyBalanceInUsd,
        borrowBalance,
        borrowBalanceInUsd,
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
  }, [supportedTokenPairs, signer, comptrollerAddress, priceOracles]);

  return markets;
}
