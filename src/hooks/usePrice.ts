import useSWR from "swr";
import { api, authedFetcher } from "@/lib/api";
import type { PriceData } from "@/types";
import { REFRESH_INTERVAL } from "@/constants";

interface UsePriceReturn {
  data: PriceData | undefined;
  isLoading: boolean;
  error: unknown;
}

export function usePrice(symbol: string): UsePriceReturn {
  const { data, isLoading, error } = useSWR<PriceData>(
    api.quote(symbol),
    authedFetcher,
    { refreshInterval: REFRESH_INTERVAL }
  );
  return { data, isLoading, error };
}
