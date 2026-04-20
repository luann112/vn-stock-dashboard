import { RS_DEFAULT_PARAMS } from "@/constants";
import type { RSParams } from "@/types";

export interface RSPreset {
  name: string;
  params: { lookback: number; slope_window: number; correction_window: number };
  tooltip: string;
}

export const RS_PRESETS: Record<string, RSPreset> = {
  conservative: {
    name: "Thận trọng (1 năm)",
    params: { lookback: 252, slope_window: 10, correction_window: 60 },
    tooltip: "lookback=252 · slope=10 · correction=60 — phù hợp giữ 3–6 tháng",
  },
  balanced: {
    name: "Cân bằng (6 tháng)",
    params: { lookback: 126, slope_window: 10, correction_window: 45 },
    tooltip: "lookback=126 · slope=10 · correction=45 — khuyến nghị mặc định",
  },
  aggressive: {
    name: "Nhạy (3 tháng)",
    params: { lookback: 63, slope_window: 5, correction_window: 30 },
    tooltip: "lookback=63 · slope=5 · correction=30 — swing trading, nhiều false signal hơn",
  },
};

export function detectPreset(params: Partial<RSParams>): string | null {
  const resolved = {
    lookback: params.lookback ?? RS_DEFAULT_PARAMS.lookback,
    slope_window: params.slope_window ?? RS_DEFAULT_PARAMS.slope_window,
    correction_window: params.correction_window ?? RS_DEFAULT_PARAMS.correction_window,
  };
  for (const [key, preset] of Object.entries(RS_PRESETS)) {
    const p = preset.params;
    if (
      resolved.lookback === p.lookback &&
      resolved.slope_window === p.slope_window &&
      resolved.correction_window === p.correction_window
    ) {
      return key;
    }
  }
  return null;
}

export function sessionsToLabel(sessions: number): string {
  if (sessions <= 21) return `${sessions} phiên ≈ 1 tháng`;
  const months = Math.round(sessions / 21);
  if (months <= 12) return `${sessions} phiên ≈ ${months} tháng`;
  const years = (sessions / 252).toFixed(1);
  return `${sessions} phiên ≈ ${years} năm`;
}
