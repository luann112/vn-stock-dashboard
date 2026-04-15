import useSWR from "swr";
import type { SWRConfiguration } from "swr";
import { api, authedFetcher } from "@/lib/api";
import type { RSScoreData, RSScanData, RSPresetsResponse, RSParams } from "@/types";
import { RS_REFRESH_INTERVAL } from "@/constants";

const SWR_OPTIONS: SWRConfiguration = {
  refreshInterval: RS_REFRESH_INTERVAL,
  onErrorRetry: (_error, _key, _config, revalidate, { retryCount }) => {
    if (retryCount >= 3) return;
    setTimeout(() => revalidate({ retryCount }), 5_000 * Math.pow(2, retryCount - 1));
  },
};

interface UseRSScoreReturn {
  data: RSScoreData | undefined;
  isLoading: boolean;
  error: unknown;
}

export function useRSScore(symbol: string, params?: Partial<RSParams>): UseRSScoreReturn {
  const { data, isLoading, error } = useSWR<RSScoreData>(
    symbol ? api.rsScore(symbol, params) : null,
    authedFetcher,
    SWR_OPTIONS
  );
  return { data, isLoading, error };
}

interface UseRSScanReturn {
  data: RSScanData | undefined;
  isLoading: boolean;
  error: unknown;
}

export function useRSScan(opts?: {
  min_score?: number;
  sort_by?: string;
  limit?: number;
} & Partial<RSParams>): UseRSScanReturn {
  const { data, isLoading, error } = useSWR<RSScanData>(
    api.rsScan(opts),
    authedFetcher,
    SWR_OPTIONS
  );
  return { data, isLoading, error };
}

interface UseRSWatchlistReturn {
  data: RSScanData | undefined;
  isLoading: boolean;
  error: unknown;
}

export function useRSWatchlist(params?: Partial<RSParams>): UseRSWatchlistReturn {
  const { data, isLoading, error } = useSWR<RSScanData>(
    api.rsWatchlist(params),
    authedFetcher,
    SWR_OPTIONS
  );
  return { data, isLoading, error };
}

interface UseRSPresetsReturn {
  data: RSPresetsResponse | undefined;
  isLoading: boolean;
  error: unknown;
}

export function useRSPresets(): UseRSPresetsReturn {
  const { data, isLoading, error } = useSWR<RSPresetsResponse>(
    api.rsPresets(),
    authedFetcher,
    { revalidateOnFocus: false }
  );
  return { data, isLoading, error };
}
