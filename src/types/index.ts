export type Signal = "BUY" | "SELL" | "HOLD" | "UNKNOWN" | "buy" | "sell" | "hold" | "unknown";

/** GET /market/quote/{symbol} */
export interface PriceData {
  symbol: string;
  price: number;
  change: number;
  change_pct: number;
  volume: number;
  time: string; // ISO datetime (Vietnam time)
}

/** GET /signals/{symbol} */
export interface SignalData {
  symbol: string;
  signal: Signal;
  price: number;
  rsi: number | null;
  ma_short: number | null; // EMA short period
  ma_long: number | null; // EMA long period
  macd: number | null;
  macd_signal: number | null;
  reasons: string[];
  analyzed_at: string; // ISO datetime
}

/** GET /watchlist — requires auth */
export interface WatchlistItem {
  symbol: string;
  added_at: string;
}

export interface WatchlistResponse {
  symbols: WatchlistItem[];
  count: number;
}

// ── RS Composite Score ──────────────────────────────────────────────────────

export type RSSignal = "market_leader" | "outperformer" | "average" | "laggard";

/** Parameters used for RS score calculation */
export interface RSParams {
  lookback: number;
  slope_window: number;
  correction_window: number;
  preset: string | null;
}

/** Breakdown of all 4 RS components */
export interface RSComponentBreakdown {
  rs_rating: number; // 0–40 weighted
  rs_rating_raw: number; // 0–100 percentile
  rs_trending: number; // 0 or 20
  rs_trending_direction: "up" | "down";
  rs_near_high: number; // 0–20 weighted
  rs_near_high_pct: number; // 0–1 fraction of high
  rs_days: number; // 0–20 weighted
  rs_days_pct: number; // 0–1 fraction outperform
  rs_days_total: number; // total index down-days
  rs_days_outperform: number; // days stock outperformed
}

/** GET /rs/{symbol} */
export interface RSScoreData {
  symbol: string;
  score: number;
  signal: RSSignal;
  breakdown: RSComponentBreakdown;
  params: RSParams;
  calculated_at: string;
}

/** GET /rs/scan, GET /rs/watchlist */
export interface RSScanData {
  results: RSScoreData[];
  count: number;
  universe: string;
  params: RSParams;
  scanned_at: string;
}

/** GET /rs/presets */
export interface RSPresetConfig {
  lookback: number;
  slope_window: number;
  correction_window: number;
  description: string;
}

export interface RSPresetsResponse {
  presets: Record<string, RSPresetConfig>;
}

/** Used locally for alert display */
export interface AlertItem {
  id: string;
  symbol: string;
  signal: Signal;
  price: number;
  rsi: number;
  timestamp: string;
  message?: string;
}
