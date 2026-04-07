"use client";

import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { usePrice } from "@/hooks/usePrice";
import { useSignal } from "@/hooks/useSignal";
import { getCompanyName } from "@/lib/api";
import { formatPrice, formatVolume, formatPercent } from "@/lib/utils";
import { SignalBadge } from "@/components/signal-badge";
import { RsiGauge } from "@/components/rsi-gauge";

export interface StockRowProps {
  symbol: string;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
}

export function StockRow({ symbol, isSelected, onSelect, onRemove }: StockRowProps) {
  const { data: price } = usePrice(symbol);
  const { data: signal } = useSignal(symbol);

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
