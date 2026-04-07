import useSWR from "swr";
import { api, historyFetcher } from "@/lib/api";
import type { OHLCVBar } from "@/types";

interface UseOHLCVReturn {
  data: OHLCVBar[] | undefined;
  isLoading: boolean;
  error: unknown;
}

export function useOHLCV(symbol: string | null, period = "3M"): UseOHLCVReturn {
  const key = symbol ? api.history(symbol, period) : null;
  const { data, isLoading, error } = useSWR<OHLCVBar[]>(key, historyFetcher);
  return { data, isLoading, error };
}
