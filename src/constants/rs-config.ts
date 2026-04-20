export const RS_DEFAULT_PARAMS = {
  lookback: 252,
  slope_window: 10,
  correction_window: 60,
} as const;

export const RS_PARAM_BOUNDS = {
  lookback: { min: 42, max: 504 },
  slope_window: { min: 3, max: 30 },
  correction_window: { min: 20, max: 126 },
} as const;

export const RS_SIGNAL_CONFIG: Readonly<
  Record<string, { className: string; label: string; color: string }>
> = {
  market_leader: { className: "badge-buy", label: "Market Leader", color: "var(--bull)" },
  outperformer: { className: "badge-hold", label: "Outperformer", color: "var(--signal-hold)" },
  average: { className: "", label: "Average", color: "var(--muted-foreground)" },
  laggard: { className: "badge-sell", label: "Laggard", color: "var(--bear)" },
};

export const LOOKBACK_LABELS: Readonly<Record<number, string>> = {
  42: "2 tháng",
  63: "3 tháng",
  126: "6 tháng",
  252: "1 năm",
  504: "2 năm",
};

export const RS_RATING_THRESHOLDS = [
  { max: 50, label: "< 50 Laggard" },
  { max: 70, label: "50–69 Average" },
  { max: 80, label: "70–79 Outperformer" },
  { max: 90, label: "80–89 Leader" },
  { max: 101, label: "≥ 90 Elite" },
] as const;

export const RS_NEAR_HIGH_THRESHOLDS = [
  { max: 70, label: "< 70% Sụt mạnh" },
  { max: 90, label: "70–90% Bình thường" },
  { max: 95, label: "90–95% Khá tốt" },
  { max: 101, label: "> 95% Gần đỉnh" },
] as const;

export const RS_DAYS_THRESHOLDS = [
  { max: 40, label: "< 40% Yếu" },
  { max: 60, label: "40–60% Trung bình" },
  { max: 101, label: "> 60% Leadership" },
] as const;
