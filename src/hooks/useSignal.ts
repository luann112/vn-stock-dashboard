import useSWR from "swr";
import { api, authedFetcher } from "@/lib/api";
import type { SignalData } from "@/types";
import { SIGNAL_REFRESH_INTERVAL } from "@/constants";

interface UseSignalReturn {
  data: SignalData | undefined;
  isLoading: boolean;
  error: unknown;
}

export function useSignal(symbol: string): UseSignalReturn {
  const { data, isLoading, error } = useSWR<SignalData>(
    api.signals(symbol),
    authedFetcher,
    { refreshInterval: SIGNAL_REFRESH_INTERVAL }
  );
  return { data, isLoading, error };
}
