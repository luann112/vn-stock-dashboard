"use client";

import { X, TrendingUp, TrendingDown } from "lucide-react";
import { usePrice } from "@/hooks/usePrice";
import { useSignal } from "@/hooks/useSignal";
import { getCompanyName } from "@/lib/api";
import { formatPrice, formatPercent } from "@/lib/utils";
import { RsiGauge } from "@/components/rsi-gauge";
import { SignalBadge } from "@/components/signal-badge";
import { StatCard } from "./StatCard";

export interface ChartPanelProps {
  symbol: string;
  onClose: () => void;
}

export function ChartPanel({ symbol, onClose }: ChartPanelProps) {
  const { data: price } = usePrice(symbol);
  const { data: signal } = useSignal(symbol);

  const isPositive = (price?.change_pct ?? 0) >= 0;

  return (
    <div
      className="rounded-xl border overflow-hidden card-surface"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg" style={{ color: "var(--foreground)" }}>
              {symbol}
            </span>
            {signal && <SignalBadge signal={signal.signal} />}
          </div>
          <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>
            {getCompanyName(symbol)}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {price && (
            <div className="text-right">
              <div className="font-mono font-bold text-xl" style={{ color: "var(--foreground)" }}>
                {formatPrice(price.price)}
              </div>
              <div
                className="font-mono text-sm flex items-center justify-end gap-1"
                style={{ color: isPositive ? "var(--bull)" : "var(--bear)" }}
              >
                {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {formatPercent(price.change_pct)}
              </div>
            </div>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors"
            style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-5 py-3 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <StatCard
          label="Thay đổi"
          value={price ? formatPrice(Math.abs(price.change)) : "—"}
          color={isPositive ? "var(--bull)" : "var(--bear)"}
        />
        <StatCard
          label="Khối lượng"
          value={price ? price.volume.toLocaleString("vi-VN") : "—"}
          color="var(--foreground)"
        />
        <StatCard
          label="MA ngắn"
          value={signal?.ma_short != null ? formatPrice(signal.ma_short) : "—"}
          color="var(--chart-1)"
        />
        <StatCard
          label="MA dài"
          value={signal?.ma_long != null ? formatPrice(signal.ma_long) : "—"}
          color="var(--chart-3)"
        />
      </div>

      {/* RSI */}
      {signal && (
        <div className="flex items-center justify-center px-5 py-4">
          <div className="flex flex-col items-center">
            <div
              className="text-xs font-semibold mb-3 uppercase tracking-wide"
              style={{ color: "var(--muted-foreground)" }}
            >
              RSI (14)
            </div>
            <RsiGauge value={signal.rsi ?? 50} size="lg" />
          </div>
        </div>
      )}
    </div>
  );
}
