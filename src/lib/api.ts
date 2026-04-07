import { getSession } from "next-auth/react";
import { API_BASE_URL, COMPANY_NAMES } from "@/constants";
import type { PriceData, SignalData, OHLCVBar, HistoryResponse } from "@/types";

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
// Fetchers
// ---------------------------------------------------------------------------

/** Unauthenticated — only used for /health */
export async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new ApiError(res.status, url);
  return res.json() as Promise<T>;
}

/**
 * Authenticated fetcher — reads FastAPI JWT from NextAuth session on every call.
 * Session is stored in a cookie (httpOnly), retrieved via getSession().
 */
export async function authedFetcher<T>(url: string): Promise<T> {
  const session = typeof window !== "undefined" ? await getSession() : null;
  const token   = session?.user?.accessToken;

  const headers: HeadersInit = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const res = await fetch(url, { headers });
  if (!res.ok) throw new ApiError(res.status, url);
  return res.json() as Promise<T>;
}

/** History endpoint unwraps the { symbol, period, bars } envelope */
export async function historyFetcher(url: string): Promise<OHLCVBar[]> {
  const res = await authedFetcher<HistoryResponse>(url);
  return res.bars;
}

// ---------------------------------------------------------------------------
// URL builders — match actual Railway API routes
// ---------------------------------------------------------------------------

export const api = {
  /** GET /market/quote/{symbol} */
  quote:    (symbol: string)                => `${API_BASE_URL}/market/quote/${symbol}`,
  /** GET /market/quotes?symbols=A,B,C */
  quotes:   (symbols: string[])             => `${API_BASE_URL}/market/quotes?symbols=${symbols.join(",")}`,
  /** GET /market/history/{symbol}?period=3M */
  history:  (symbol: string, period = "3M") => `${API_BASE_URL}/market/history/${symbol}?period=${period}`,
  /** GET /signals/{symbol} */
  signals:  (symbol: string)                => `${API_BASE_URL}/signals/${symbol}`,
  /** GET /watchlist  (requires Bearer) */
  watchlist: ()                             => `${API_BASE_URL}/watchlist`,
  /** GET /health */
  health:   ()                              => `${API_BASE_URL}/health`,
} as const;

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

export async function getOHLCV(symbol: string, period = "3M"): Promise<OHLCVBar[]> {
  return historyFetcher(api.history(symbol, period));
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
