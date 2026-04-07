"use client";

import { usePrice } from "@/hooks/usePrice";
import { formatPercent, formatVolume } from "@/lib/utils";

export interface HeatCellProps {
  symbol: string;
}

import { HEAT_CELL_SIZE } from "@/constants";

/** Returns a CSS variable for heatmap cell background based on % change */
function getHeatBackground(pct: number): string {
  if (pct > 5)   return "var(--heat-strong-bull)";
  if (pct > 3)   return "var(--heat-mid-bull)";
  if (pct > 1)   return "var(--heat-light-bull)";
  if (pct > 0)   return "var(--heat-faint-bull)";
  if (pct === 0) return "var(--heat-neutral)";
  if (pct > -1)  return "var(--heat-faint-bear)";
  if (pct > -3)  return "var(--heat-light-bear)";
  if (pct > -5)  return "var(--heat-mid-bear)";
  return "var(--heat-strong-bear)";
}

/** Returns a CSS variable for heatmap cell text color based on % change */
function getHeatTextColor(pct: number): string {
  if (Math.abs(pct) >= 3) return "var(--primary-foreground)";
  if (pct > 0)   return "var(--bull-foreground)";
  if (pct < 0)   return "var(--bear-foreground)";
  return "var(--muted-foreground)";
}

export function HeatCell({ symbol }: HeatCellProps) {
  const { data } = usePrice(symbol);

  const pct    = data?.change_pct ?? 0;
  const volume = data?.volume ?? 0;

  return (
    <div
      title={`${symbol} — ${formatPercent(pct)} — Vol: ${formatVolume(volume)}`}
      className="rounded-lg flex flex-col items-center justify-center cursor-default transition-transform hover:scale-105"
      style={{
        background: data ? getHeatBackground(pct) : "var(--muted)",
        color:      data ? getHeatTextColor(pct)  : "var(--muted-foreground)",
        width: HEAT_CELL_SIZE,
        height: HEAT_CELL_SIZE,
        padding: 8,
      }}
    >
      <div className="font-bold text-sm">{symbol}</div>
      {data ? (
        <>
          <div className="font-mono text-xs mt-0.5 font-medium">{formatPercent(pct)}</div>
          <div className="text-xs mt-0.5 opacity-80" style={{ fontSize: 9 }}>
            {formatVolume(volume)}
          </div>
        </>
      ) : (
        <div className="text-xs opacity-50 mt-1">...</div>
      )}
    </div>
  );
}
