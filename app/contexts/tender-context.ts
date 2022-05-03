import { createContext } from "react";
import { NetworkData, TokenPair } from "~/types/global";

interface TenderContext {
  tokenPairs: TokenPair[];
  networkData: NetworkData;
}

export const TenderContext = createContext<TenderContext>({
  tokenPairs: [],
  networkData: null,
});
