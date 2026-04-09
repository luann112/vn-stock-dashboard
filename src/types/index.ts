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
  ma_long: number | null;  // EMA long period
  macd: number | null;
  macd_signal: number | null;
  reasons: string[];
  analyzed_at: string; // ISO datetime
}

/** Single candlestick bar from GET /market/history/{symbol} */
export interface OHLCVBar {
  time: string; // ISO date string "YYYY-MM-DD"
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/** Full response from GET /market/history/{symbol} */
export interface HistoryResponse {
  symbol: string;
  period: string;
  bars: OHLCVBar[];
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
