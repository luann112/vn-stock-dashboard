import { API_BASE_URL, COMPANY_NAMES, RS_DEFAULT_PARAMS } from "@/constants";
import type {
  PriceData,
  SignalData,
  RSScoreData,
  RSScanData,
  RSPresetsResponse,
  RSParams,
} from "@/types";

// ---------------------------------------------------------------------------
// Error class
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly endpoint: string
  ) {
    super(`API ${status} — ${endpoint}`);
    this.name = "ApiError";
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError;
}

// ---------------------------------------------------------------------------
// Token cache — synced from useSession() via AuthSync component.
// Eliminates per-fetch getSession() calls (each was an HTTP roundtrip).
// ---------------------------------------------------------------------------

let _cachedToken: string | null = null;

/** Called by AuthSync to keep the module-level token in sync with NextAuth session. */
export function setAuthToken(token: string | null): void {
  _cachedToken = token;
}

// ---------------------------------------------------------------------------
// Fetchers
// ---------------------------------------------------------------------------

/** Unauthenticated — only used for /health */
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new ApiError(res.status, url);
  return res.json() as Promise<T>;
}

/**
 * Authenticated fetcher — reads cached FastAPI JWT (set by AuthSync).
 * No HTTP roundtrip to /api/auth/session on every call.
 */
export async function authedFetcher<T>(url: string): Promise<T> {
  const headers: HeadersInit = _cachedToken ? { Authorization: `Bearer ${_cachedToken}` } : {};

  const res = await fetch(url, { headers });
  if (!res.ok) throw new ApiError(res.status, url);
  return res.json() as Promise<T>;
}

// ---------------------------------------------------------------------------
// URL builders — match actual Railway API routes
// ---------------------------------------------------------------------------

export const api = {
  /** GET /market/quote/{symbol} */
  quote: (symbol: string) => `${API_BASE_URL}/market/quote/${symbol}`,
  /** GET /market/quotes?symbols=A,B,C */
  quotes: (symbols: string[]) => `${API_BASE_URL}/market/quotes?symbols=${symbols.join(",")}`,
  /** GET /signals/{symbol} */
  signals: (symbol: string) => `${API_BASE_URL}/signals/${symbol}`,
  /** GET /watchlist  (requires Bearer) */
  watchlist: () => `${API_BASE_URL}/watchlist`,
  /** GET /health */
  health: () => `${API_BASE_URL}/health`,

  // ── RS Composite Score ──────────────────────────────────────
  /** GET /rs/{symbol}?lookback=&slope_window=&correction_window=&preset= */
  rsScore: (symbol: string, params?: Partial<RSParams>) => {
    const base = `${API_BASE_URL}/rs/${symbol}`;
    const qs = _rsQueryString(params);
    return qs ? `${base}?${qs}` : base;
  },
  /** GET /rs/scan?min_score=&sort_by=&limit=&... */
  rsScan: (
    opts?: {
      min_score?: number;
      sort_by?: string;
      limit?: number;
    } & Partial<RSParams>
  ) => {
    const parts: string[] = [];
    if (opts?.min_score !== undefined) parts.push(`min_score=${opts.min_score}`);
    if (opts?.sort_by) parts.push(`sort_by=${opts.sort_by}`);
    if (opts?.limit !== undefined) parts.push(`limit=${opts.limit}`);
    const rsQs = _rsQueryString(opts);
    if (rsQs) parts.push(rsQs);
    const qs = parts.join("&");
    return qs ? `${API_BASE_URL}/rs/scan?${qs}` : `${API_BASE_URL}/rs/scan`;
  },
  /** GET /rs/watchlist?lookback=&slope_window=&correction_window= */
  rsWatchlist: (params?: Partial<RSParams>) => {
    const base = `${API_BASE_URL}/rs/watchlist`;
    const qs = _rsQueryString(params);
    return qs ? `${base}?${qs}` : base;
  },
  /** GET /rs/presets */
  rsPresets: () => `${API_BASE_URL}/rs/presets`,
} as const;

/** Build query string for RS params (only includes non-default values). */
function _rsQueryString(params?: Partial<RSParams>): string {
  if (!params) return "";
  const parts: string[] = [];
  if (params.preset) {
    parts.push(`preset=${params.preset}`);
  } else {
    if (params.lookback && params.lookback !== RS_DEFAULT_PARAMS.lookback) {
      parts.push(`lookback=${params.lookback}`);
    }
    if (params.slope_window && params.slope_window !== RS_DEFAULT_PARAMS.slope_window) {
      parts.push(`slope_window=${params.slope_window}`);
    }
    if (
      params.correction_window &&
      params.correction_window !== RS_DEFAULT_PARAMS.correction_window
    ) {
      parts.push(`correction_window=${params.correction_window}`);
    }
  }
  return parts.join("&");
}

// ---------------------------------------------------------------------------
// Typed fetch helpers (imperative use outside SWR)
// ---------------------------------------------------------------------------

export async function getPrice(symbol: string): Promise<PriceData> {
  return authedFetcher<PriceData>(api.quote(symbol));
}

export async function getPriceBatch(symbols: string[]): Promise<PriceData[]> {
  if (symbols.length === 0) return [];
  return authedFetcher<PriceData[]>(api.quotes(symbols));
}

export async function getSignal(symbol: string): Promise<SignalData> {
  return authedFetcher<SignalData>(api.signals(symbol));
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

export function getCompanyName(symbol: string): string {
  return COMPANY_NAMES[symbol] ?? symbol;
}
