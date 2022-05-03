import { createContext } from "react";
import type { TenderContext as TenderContextType } from "~/types/global";

export const TenderContext = createContext<TenderContextType>(null);
