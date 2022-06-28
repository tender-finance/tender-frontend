import { useState, useEffect, useContext } from "react";
import type { Market, TokenPair } from "~/types/global";
import type { JsonRpcSigner } from "@ethersproject/providers";
import {
  formattedBorrowApy,
  formattedDepositApy,
} from "~/lib/apy-calculations";
import {
  getAccountBorrowLimitInUsd,
  getBorrowLimitUsed,
  getCurrentlyBorrowing,
  getCurrentlySupplying,
  getMarketSizeUsd,
  getTotalBorrowedUsd,
  getWalletBalance,
  getTotalBorrowedInUsd,
  getMaxBorrowLiquidity,
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
  signer: JsonRpcSigner | null | undefined,
  supportedTokenPairs: TokenPair[],
  comptrollerAddress: string | undefined
) {
  let [markets, setMarkets] = useState<Market[]>([]);

  let pollingKey = useInterval(7_000);
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

      let supplyBalanceInUsd = supplyBalance * tp.token.priceInUsd;
      let borrowBalanceInUsd = borrowBalance * tp.token.priceInUsd;

      let maxBorrowLiquidity = await getMaxBorrowLiquidity(signer, tp);

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
        maxBorrowLiquidity,
      };
    });

    Promise.all(newMarkets).then((nm) => setMarkets(nm));
  }, [
    signer,
    supportedTokenPairs,
    comptrollerAddress,
    pollingKey,
    currentTransaction,
  ]);

  return markets;
}
