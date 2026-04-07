import useSWR from "swr";
import { api, authedFetcher } from "@/lib/api";
import type { PriceData } from "@/types";
import { REFRESH_INTERVAL } from "@/constants";

interface UsePriceBatchReturn {
  data: PriceData[] | undefined;
  isLoading: boolean;
  error: unknown;
  bySymbol: Map<string, PriceData>;
}

export function usePriceBatch(symbols: string[]): UsePriceBatchReturn {
  const key = symbols.length > 0 ? api.quotes(symbols) : null;
  const { data, isLoading, error } = useSWR<PriceData[]>(key, authedFetcher, {
    refreshInterval: REFRESH_INTERVAL,
  });

  const bySymbol = new Map<string, PriceData>();
  if (data) {
    for (const item of data) {
      bySymbol.set(item.symbol, item);
    }
  }

  return { data, isLoading, error, bySymbol };
}
