/**
 * vn-stock-dashboard — Design Tokens
 * Source of truth cho toàn bộ design system.
 * Import file này thay vì hardcode giá trị bất kỳ.
 *
 * Usage:
 *   import { tokens } from "@/lib/design-tokens"
 *   // Dùng Tailwind class trực tiếp là preferred
 *   // File này dùng cho TradingView chart config, dynamic styles
 */

export const tokens = {
  // ── Colors ────────────────────────────────────────────────
  color: {
    // Stock semantic — dùng nhiều nhất
    bull:            "var(--bull)",
    bullMuted:       "var(--bull-muted)",
    bear:            "var(--bear)",
    bearMuted:       "var(--bear-muted)",
    neutral:         "var(--neutral)",
    signalBuy:       "var(--signal-buy)",
    signalSell:      "var(--signal-sell)",
    signalHold:      "var(--signal-hold)",

    // Candle — dùng cho TradingView Lightweight Charts
    candleBull:      "var(--candle-bull)",
    candleBullWick:  "var(--candle-bull-wick)",
    candleBear:      "var(--candle-bear)",
    candleBearWick:  "var(--candle-bear-wick)",

    // Core UI
    background:      "var(--background)",
    foreground:      "var(--foreground)",
    card:            "var(--card)",
    border:          "var(--border)",
    muted:           "var(--muted)",
    mutedForeground: "var(--muted-foreground)",
    primary:         "var(--primary)",

    // Chart palette
    chart: [
      "var(--chart-1)",
      "var(--chart-2)",
      "var(--chart-3)",
      "var(--chart-4)",
      "var(--chart-5)",
      "var(--chart-6)",
      "var(--chart-7)",
      "var(--chart-8)",
      "var(--chart-9)",
      "var(--chart-10)",
    ] as const,
  },

  // ── Typography ────────────────────────────────────────────
  font: {
    sans:    '"Outfit", -apple-system, sans-serif',
    mono:    '"IBM Plex Mono", "Fira Code", monospace',
    numeric: '"IBM Plex Mono", monospace', // tabular nums
  },

  fontSize: {
    priceXs: "0.75rem",
    priceSm: "0.875rem",
    priceMd: "1rem",
    priceLg: "1.5rem",
    priceXl: "2rem",
  },

  // ── Layout ────────────────────────────────────────────────
  layout: {
    sidebarWidth:     "240px",
    sidebarCollapsed: "64px",
    headerHeight:     "56px",
    panelGap:         "16px",
  },

  // ── Border radius ─────────────────────────────────────────
  radius: {
    sm: "4px",
    md: "6px",
    lg: "8px",   // default card/button (TailAdmin rounded-lg)
    xl: "12px",  // panels, dropdowns
    "2xl": "16px", // modals
  },
} as const;

// ── TradingView Lightweight Charts theme ───────────────────
// Dùng trực tiếp trong createChart() options
export function getTradingViewTheme(isDark = true) {
  return {
    layout: {
      background:    { color: isDark ? "#1d2939" : "#ffffff" },
      textColor:     isDark ? "#98a2b3" : "#667085",
      fontSize:      12,
      fontFamily:    '"IBM Plex Mono", monospace',
    },
    grid: {
      vertLines:   { color: isDark ? "#344054" : "#e4e7ec", style: 1 },
      horzLines:   { color: isDark ? "#344054" : "#e4e7ec", style: 1 },
    },
    crosshair: {
      vertLine: { color: isDark ? "#6172f3" : "#465fff", width: 1, style: 1, labelBackgroundColor: isDark ? "#6172f3" : "#465fff" },
      horzLine: { color: isDark ? "#6172f3" : "#465fff", width: 1, style: 1, labelBackgroundColor: isDark ? "#6172f3" : "#465fff" },
    },
    timeScale: {
      borderColor:     isDark ? "#344054" : "#e4e7ec",
      timeVisible:     true,
      secondsVisible:  false,
    },
    rightPriceScale: {
      borderColor:     isDark ? "#344054" : "#e4e7ec",
    },
  };
}

export function getCandlestickOptions(isDark = true) {
  return {
    upColor:          isDark ? "#32d583" : "#12b76a",
    downColor:        isDark ? "#f97066" : "#f04438",
    borderUpColor:    isDark ? "#12b76a" : "#039855",
    borderDownColor:  isDark ? "#f04438" : "#d92d20",
    wickUpColor:      isDark ? "#12b76a" : "#039855",
    wickDownColor:    isDark ? "#f04438" : "#d92d20",
  };
}

// ── MA line colors (chart library needs raw hex) ───────────
export function getMaColors(isDark = true) {
  return {
    short: isDark ? "#36bffa" : "#0ba5ec",
    long:  isDark ? "#fdb022" : "#f79009",
  };
}

// ── Signal badge helper ────────────────────────────────────
export type SignalType = "BUY" | "SELL" | "HOLD" | "NONE";
export type DivergenceType = "bullish" | "bearish" | "conflict" | "none";

export const signalStyles: Record<SignalType, { className: string; label: string }> = {
  BUY:  { className: "badge-buy",  label: "MUA" },
  SELL: { className: "badge-sell", label: "BÁN" },
  HOLD: { className: "badge-hold", label: "GIỮ" },
  NONE: { className: "text-muted-foreground", label: "—" },
};

export const divergenceStyles: Record<DivergenceType, { className: string; label: string }> = {
  bullish:  { className: "heatmap-bull",     label: "Bullish" },
  bearish:  { className: "heatmap-bear",     label: "Bearish" },
  conflict: { className: "heatmap-conflict", label: "Conflict" },
  none:     { className: "heatmap-none",     label: "—" },
};
