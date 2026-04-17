import { useState, useCallback, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import type { RSParams } from "@/types";

const RS_DEBOUNCE_MS = 600;
const RS_PARAMS_STORAGE_KEY = "vn-stock-rs-params";

function loadSavedParams(): Partial<RSParams> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem(RS_PARAMS_STORAGE_KEY);
    if (!saved) return {};
    const parsed = JSON.parse(saved) as unknown;
    if (parsed && typeof parsed === "object") return parsed as Partial<RSParams>;
  } catch {
    // ignore
  }
  return {};
}

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
  const [saved] = useState(loadSavedParams);
  const [uiParams, setUiParams] = useState<Partial<RSParams>>(saved);
  const [apiParams, setApiParams] = useState<Partial<RSParams>>(saved);
  const [isPending, setIsPending] = useState(false);
  const latestUiRef = useRef<Partial<RSParams>>(saved);

  const flushToApi = useDebouncedCallback((params: Partial<RSParams>) => {
    setApiParams(params);
    setIsPending(false);
    localStorage.setItem(RS_PARAMS_STORAGE_KEY, JSON.stringify(params));
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
