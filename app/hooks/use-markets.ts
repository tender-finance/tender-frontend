import { useState, useEffect, useContext } from "react";
import type { Market, TokenPair } from "~/types/global";
import type { JsonRpcSigner } from "@ethersproject/providers";
import { hooks as Web3Hooks } from "~/connectors/meta-mask";
import { useWeb3Signer } from "~/hooks/use-web3-signer";
import {
  formattedBorrowApy,
  formattedDepositApy,
} from "~/lib/apy-calculations";
import {
  getAssetPriceInUsd,
  getAccountBorrowLimitInUsd,
  getBorrowLimitUsed,
  getCurrentlyBorrowing,
  getCurrentlySupplying,
  getMarketSizeUsd,
  getTotalBorrowedUsd,
  getWalletBalance,
  getTotalBorrowedInUsd,
} from "~/lib/tender";
import { useInterval } from "./use-interval";
import { TenderContext } from "~/contexts/tender-context";

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

  // TODO: don't think we're using these two fields,
  // but we might when we build the individual market pages?
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

  let pollingKey = useInterval(10_000);
  let { currentTransaction } = useContext(TenderContext);

  useEffect(() => {
    if (!signer || !comptrollerAddress) {
      return;
    }

    let newMarkets = supportedTokenPairs.map(async (tp): Promise<Market> => {
      // TODO: optimize with parallelization
      let totalBorrowedAmountInUsd = await getTotalBorrowedInUsd(
        signer,
        supportedTokenPairs
      );
      let accountBorrowLimitInUsd = await getAccountBorrowLimitInUsd(
        signer,
        comptrollerAddress,
        supportedTokenPairs
      );

      let assetPriceInUsd: number = await getAssetPriceInUsd(
        signer,
        tp.token.priceOracleAddress
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
        marketData: await getMarketData(signer, tp),
        walletBalance: await getWalletBalance(signer, tp.token),
        supplyBalance,
        supplyBalanceInUsd,
        borrowBalance,
        borrowBalanceInUsd,
        comptrollerAddress,
        borrowLimit: accountBorrowLimitInUsd,
        totalBorrowedAmountInUsd,
        borrowLimitUsedOfToken: await getBorrowLimitUsed(
          borrowBalanceInUsd,
          accountBorrowLimitInUsd
        ),
        borrowLimitUsed: await getBorrowLimitUsed(
          totalBorrowedAmountInUsd,
          accountBorrowLimitInUsd
        ),
      };
    });

    Promise.all(newMarkets).then((nm) => setMarkets(nm));
  }, [
    supportedTokenPairs,
    signer,
    comptrollerAddress,
    pollingKey,
    currentTransaction,
  ]);

  return markets;
}
