"use client";

import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { usePrice } from "@/hooks/usePrice";
import { useSignal } from "@/hooks/useSignal";
import { useRSScore } from "@/hooks/useRSScore";
import { getCompanyName } from "@/lib/api";
import { formatPrice, formatVolume, formatPercent } from "@/lib/utils";
import { SignalBadge } from "@/components/signal-badge";
import { RsiGauge } from "@/components/rsi-gauge";
import { RSScoreBadge } from "@/components/rs-score-badge";
import type { RSParams } from "@/types";

export interface StockRowProps {
  symbol: string;
  isSelected: boolean;
  rsParams?: Partial<RSParams>;
  isRSPending?: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onRSClick?: (symbol: string) => void;
}

export function StockRow({
  symbol, isSelected, rsParams, isRSPending = false, onSelect, onRemove, onRSClick,
}: StockRowProps) {
  const { data: price } = usePrice(symbol);
  const { data: signal } = useSignal(symbol);
  const { data: rsScore } = useRSScore(symbol, rsParams);

  const isPositive = (price?.change_pct ?? 0) >= 0;

  function handleMouseEnter(e: React.MouseEvent<HTMLTableRowElement>): void {
    if (!isSelected) e.currentTarget.style.background = "var(--secondary)";
  }

  function handleMouseLeave(e: React.MouseEvent<HTMLTableRowElement>): void {
    if (!isSelected) e.currentTarget.style.background = "transparent";
  }

  function handleRemove(e: React.MouseEvent<HTMLButtonElement>): void {
    e.stopPropagation();
    onRemove();
  }

  return (
    <tr
      onClick={onSelect}
      className="cursor-pointer transition-colors"
      style={{ background: isSelected ? "var(--accent)" : "transparent" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span style={{ color: "var(--muted-foreground)", width: 12 }}>
            {isSelected ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          </span>
          <div>
            <div className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
              {symbol}
            </div>
            <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              {getCompanyName(symbol)}
            </div>
          </div>
        </div>
      </td>

      <td className="px-4 py-3 text-right">
        <span className="font-mono font-semibold text-sm" style={{ color: "var(--foreground)" }}>
          {price ? formatPrice(price.price) : "—"}
        </span>
      </td>

      <td className="px-4 py-3 text-right">
        <span
          className="font-mono text-sm font-medium"
          style={{ color: isPositive ? "var(--bull)" : "var(--bear)" }}
        >
          {price ? formatPercent(price.change_pct) : "—"}
        </span>
      </td>

      <td className="px-4 py-3 text-right">
        <span className="font-mono text-sm" style={{ color: "var(--muted-foreground)" }}>
          {price ? formatVolume(price.volume) : "—"}
        </span>
      </td>

      <td className="px-4 py-3">
        {signal
          ? <RsiGauge value={signal.rsi ?? 50} size="sm" />
          : <span style={{ color: "var(--muted-foreground)" }}>—</span>}
      </td>

      <td className="px-4 py-3">
        {signal
          ? <SignalBadge signal={signal.signal} />
          : <span style={{ color: "var(--muted-foreground)" }}>—</span>}
      </td>

      <td className="px-4 py-3 text-center">
        {rsScore ? (
          <RSScoreBadge
            score={rsScore.score}
            signal={rsScore.signal}
            isTrendingUp={rsScore.breakdown.rs_trending_direction === "up"}
            isPending={isRSPending}
            onClick={onRSClick ? () => onRSClick(symbol) : undefined}
          />
        ) : (
          <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>—</span>
        )}
      </td>

      <td className="px-4 py-3">
        <button
          onClick={handleRemove}
          className="p-1 rounded transition-colors opacity-40 hover:opacity-100"
          style={{ color: "var(--bear)" }}
          title="Xóa khỏi danh mục"
        >
          <Trash2 size={14} />
        </button>
      </td>
    </tr>
  );
}
