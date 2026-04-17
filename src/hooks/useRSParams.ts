import { useState, useCallback, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { RSParams } from "@/types";

const RS_DEBOUNCE_MS = 600;

interface UseRSParamsReturn {
  /** Params for UI display — updates immediately */
  uiParams: Partial<RSParams>;
  /** Params for SWR/API — updates after debounce */
  apiParams: Partial<RSParams>;
  /** True while uiParams differs from apiParams (debounce pending) */
  isPending: boolean;
  /** Update params — UI updates instantly, API updates after 600ms */
  setParams: (params: Partial<RSParams>) => void;
}

export function useRSParams(): UseRSParamsReturn {
  const [uiParams, setUiParams] = useState<Partial<RSParams>>({});
  const [apiParams, setApiParams] = useState<Partial<RSParams>>({});
  const [isPending, setIsPending] = useState(false);
  const latestUiRef = useRef<Partial<RSParams>>({});

  const flushToApi = useDebouncedCallback((params: Partial<RSParams>) => {
    setApiParams(params);
    setIsPending(false);
  }, RS_DEBOUNCE_MS);

  const setParams = useCallback(
    (incoming: Partial<RSParams>) => {
      const next = { ...latestUiRef.current, ...incoming };
      latestUiRef.current = next;
      setUiParams(next);
      setIsPending(true);
      flushToApi(next);
    },
    [flushToApi]
  );

  return { uiParams, apiParams, isPending, setParams };
}
