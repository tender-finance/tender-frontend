import { createContext } from "react";
import type { TenderContext as TenderContextType } from "~/types/global";

// We must initialize this context with a proper TenderContextType to avoid
// Runtime errors
export const TenderContext = createContext<TenderContextType>(
  {} as TenderContextType
);
