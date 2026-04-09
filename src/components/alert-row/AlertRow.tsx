"use client";

import type { Signal } from "@/types";
import { useSignal } from "@/hooks/useSignal";
import { getCompanyName } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { SignalBadge } from "@/components/signal-badge";

export interface AlertRowProps {
  symbol: string;
  filter: Signal | "ALL";
}

export function AlertRow({ symbol, filter }: AlertRowProps) {
  const { data: signal } = useSignal(symbol);

  if (!signal) return null;
  if (filter !== "ALL" && signal.signal.toUpperCase() !== filter) return null;

  const date = new Date(signal.analyzed_at || Date.now());
  const timeStr = isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("vi-VN", {
        day: "2-digit", month: "2-digit",
        hour: "2-digit", minute: "2-digit",
      });

  const rsiColor =
    (signal.rsi ?? 50) >= 70 ? "var(--bear)"
    : (signal.rsi ?? 50) <= 30 ? "var(--bull)"
    : "var(--neutral)";

  return (
    <tr
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--secondary)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      className="transition-colors"
    >
      <td className="px-4 py-3">
        <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
          {symbol}
        </div>
        <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {getCompanyName(symbol)}
        </div>
      </td>
      <td className="px-4 py-3">
        <SignalBadge signal={signal.signal} />
      </td>
      <td className="px-4 py-3 text-right">
        <span className="font-mono text-sm" style={{ color: "var(--foreground)" }}>
          {formatPrice(signal.price)}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="font-mono text-sm font-medium" style={{ color: rsiColor }}>
          {signal.rsi != null ? signal.rsi.toFixed(1) : "—"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          MA short:{" "}
          <span className="font-mono" style={{ color: "var(--chart-1)" }}>
            {signal.ma_short != null ? formatPrice(signal.ma_short) : "—"}
          </span>
        </div>
        <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          MA long:{" "}
          <span className="font-mono" style={{ color: "var(--chart-3)" }}>
            {signal.ma_long != null ? formatPrice(signal.ma_long) : "—"}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 text-xs" style={{ color: "var(--muted-foreground)" }}>
        {timeStr}
      </td>
    </tr>
  );
}
