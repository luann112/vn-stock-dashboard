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
    sans:    '"Inter", -apple-system, sans-serif',
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
    sm: "8px",
    md: "10px",
    lg: "12px",  // default card
    xl: "16px",
    "2xl": "20px",
  },
} as const;

// ── TradingView Lightweight Charts theme ───────────────────
// Dùng trực tiếp trong createChart() options
export function getTradingViewTheme(isDark = true) {
  return {
    layout: {
      background:    { color: isDark ? "#111318" : "#ffffff" },
      textColor:     isDark ? "#94a3b8" : "#64748b",
      fontSize:      12,
      fontFamily:    '"IBM Plex Mono", monospace',
    },
    grid: {
      vertLines:   { color: isDark ? "#1e2430" : "#e2e8f0", style: 1 },
      horzLines:   { color: isDark ? "#1e2430" : "#e2e8f0", style: 1 },
    },
    crosshair: {
      vertLine: { color: isDark ? "#22d3ee" : "#0891b2", width: 1, style: 1, labelBackgroundColor: isDark ? "#22d3ee" : "#0891b2" },
      horzLine: { color: isDark ? "#22d3ee" : "#0891b2", width: 1, style: 1, labelBackgroundColor: isDark ? "#22d3ee" : "#0891b2" },
    },
    timeScale: {
      borderColor:     isDark ? "#1e2430" : "#e2e8f0",
      timeVisible:     true,
      secondsVisible:  false,
    },
    rightPriceScale: {
      borderColor:     isDark ? "#1e2430" : "#e2e8f0",
    },
  };
}

export function getCandlestickOptions(isDark = true) {
  return {
    upColor:          isDark ? "#34d399" : "#10b981",
    downColor:        isDark ? "#f87171" : "#ef4444",
    borderUpColor:    isDark ? "#10b981" : "#059669",
    borderDownColor:  isDark ? "#ef4444" : "#dc2626",
    wickUpColor:      isDark ? "#10b981" : "#059669",
    wickDownColor:    isDark ? "#ef4444" : "#dc2626",
  };
}

// ── MA line colors (chart library needs raw hex) ───────────
export function getMaColors(isDark = true) {
  return {
    short: isDark ? "#22d3ee" : "#0891b2",
    long:  isDark ? "#fbbf24" : "#f59e0b",
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
