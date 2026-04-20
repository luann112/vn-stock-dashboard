// ── Re-exports ───────────────────────────────────────────────
export {
  DEFAULT_SYMBOLS,
  POPULAR_SYMBOLS,
  HOSE_SYMBOLS,
  HNX_SYMBOLS,
  COMPANY_NAMES,
} from "./symbols";
export {
  RS_DEFAULT_PARAMS,
  RS_PARAM_BOUNDS,
  RS_SIGNAL_CONFIG,
  LOOKBACK_LABELS,
  RS_RATING_THRESHOLDS,
  RS_NEAR_HIGH_THRESHOLDS,
  RS_DAYS_THRESHOLDS,
} from "./rs-config";

// ── Refresh intervals ────────────────────────────────────────
export const REFRESH_INTERVAL = 30_000;
export const SIGNAL_REFRESH_INTERVAL = 300_000;
export const RS_REFRESH_INTERVAL = 300_000;
export const PENDING_STATUS_POLL_INTERVAL = 10_000;

// ── API ──────────────────────────────────────────────────────
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://vn-stock-api.railway.app";

// ── Storage keys ─────────────────────────────────────────────
export const WATCHLIST_STORAGE_KEY = "vn-stock-watchlist";
export const SELECTED_SYMBOL_KEY = "vn-stock-selected-symbol";

// ── UI Constants ─────────────────────────────────────────────
export const CHART_HEIGHT = 320;
export const HEAT_CELL_SIZE = 90;

// ── Signal badge config ──────────────────────────────────────
export const SIGNAL_CONFIG: Record<string, { className: string; label: string }> = {
  BUY: { className: "badge-buy", label: "MUA" },
  SELL: { className: "badge-sell", label: "BÁN" },
  HOLD: { className: "badge-hold", label: "GIỮ" },
  UNKNOWN: { className: "badge-hold", label: "—" },
};

// ── Table headers ────────────────────────────────────────────
export const WATCHLIST_TABLE_HEADERS = [
  { label: "Mã / Tên", align: "left" },
  { label: "Giá", align: "right" },
  { label: "% Ngày", align: "right" },
  { label: "Khối lượng", align: "right" },
  { label: "RSI", align: "left" },
  { label: "Tín hiệu", align: "left" },
  { label: "RS Score", align: "center" },
  { label: "", align: "left" },
] as const;

export const ALERT_TABLE_HEADERS = [
  "Mã / Tên",
  "Tín hiệu",
  "Giá",
  "RSI",
  "Moving Averages",
  "Thời gian",
] as const;

// ── Filter options ───────────────────────────────────────────
export const ALERT_FILTER_OPTIONS: readonly { value: string; label: string }[] = [
  { value: "ALL", label: "Tất cả" },
  { value: "BUY", label: "Mua (BUY)" },
  { value: "SELL", label: "Bán (SELL)" },
  { value: "HOLD", label: "Giữ (HOLD)" },
] as const;

// ── Heatmap legend ───────────────────────────────────────────
export const HEATMAP_LEGEND_ITEMS = [
  { cssVar: "var(--heat-strong-bull)", label: ">+5%" },
  { cssVar: "var(--heat-mid-bull)", label: "+1 ~ +5%" },
  { cssVar: "var(--heat-light-bull)", label: "0 ~ +1%" },
  { cssVar: "var(--heat-neutral)", label: "0%" },
  { cssVar: "var(--heat-faint-bear)", label: "-1 ~ 0%" },
  { cssVar: "var(--heat-mid-bear)", label: "-5 ~ -1%" },
  { cssVar: "var(--heat-strong-bear)", label: "<-5%" },
] as const;
