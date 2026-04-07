import type { UTCTimestamp } from "lightweight-charts";
import type { OHLCVBar } from "@/types";

export interface MaPoint {
  time: UTCTimestamp;
  value: number;
}

/** Convert "YYYY-MM-DD" ISO date → unix seconds */
function isoToTimestamp(iso: string): UTCTimestamp {
  return Math.floor(new Date(iso).getTime() / 1000) as UTCTimestamp;
}

export function computeMa(bars: OHLCVBar[], period: number): MaPoint[] {
  const closes = bars.map((b) => b.close);
  const result: MaPoint[] = [];

  for (let i = period - 1; i < bars.length; i++) {
    const bar = bars[i];
    if (!bar) continue;
    const slice = closes.slice(i - (period - 1), i + 1);
    const avg = slice.reduce((sum, v) => sum + v, 0) / period;
    result.push({ time: isoToTimestamp(bar.time), value: avg });
  }

  return result;
}
