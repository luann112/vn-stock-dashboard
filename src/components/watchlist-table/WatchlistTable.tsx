"use client";

import { useState, useCallback, useRef } from "react";
import { StockRow } from "@/components/stock-row";
import { SkeletonRow } from "@/components/skeleton";
import { RSBreakdownModal } from "@/components/rs-breakdown-panel";
import { RSParamSelector } from "@/components/rs-param-selector";
import { useRSParams } from "@/hooks/useRSParams";
import { WATCHLIST_TABLE_HEADERS } from "@/constants";
import { EmptyState } from "./EmptyState";

export interface WatchlistTableProps {
  symbols: string[];
  selectedSymbol: string | null;
  isLoading?: boolean;
  onSelect: (symbol: string) => void;
  onRemove: (symbol: string) => void;
  onReorder?: (newSymbols: string[]) => void;
}

export function WatchlistTable({
  symbols,
  selectedSymbol,
  isLoading = false,
  onSelect,
  onRemove,
  onReorder,
}: WatchlistTableProps) {
  const [rsModalSymbol, setRsModalSymbol] = useState<string | null>(null);
  const { uiParams, apiParams, isPending: isRSPending, setParams: setRsParams } = useRSParams();
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  function handleDragStart(index: number) {
    return (e: React.DragEvent<HTMLTableRowElement>) => {
      dragIndexRef.current = index;
      e.dataTransfer.effectAllowed = "move";
      e.currentTarget.style.opacity = "0.5";
    };
  }

  function handleDragOver(index: number) {
    return (e: React.DragEvent<HTMLTableRowElement>) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDragOverIndex(index);
    };
  }

  function handleDragEnd(e: React.DragEvent<HTMLTableRowElement>) {
    e.currentTarget.style.opacity = "1";
    dragIndexRef.current = null;
    setDragOverIndex(null);
  }

  function handleDrop(targetIndex: number) {
    return (e: React.DragEvent<HTMLTableRowElement>) => {
      e.preventDefault();
      const fromIndex = dragIndexRef.current;
      if (fromIndex === null || fromIndex === targetIndex || !onReorder) return;

      const next = [...symbols];
      const [moved] = next.splice(fromIndex, 1);
      if (!moved) return;
      next.splice(targetIndex, 0, moved);
      onReorder(next);

      dragIndexRef.current = null;
      setDragOverIndex(null);
    };
  }

  const handleRSClick = useCallback((symbol: string) => {
    setRsModalSymbol((prev) => (prev === symbol ? null : symbol));
  }, []);

  return (
    <div
      className="rounded-xl border overflow-hidden card-surface"
      style={{ borderColor: "var(--border)" }}
    >
      {/* RS Param Selector — shared for all rows */}
      <div className="px-4 py-2" style={{ borderBottom: "1px solid var(--border)" }}>
        <RSParamSelector value={uiParams} onChange={setRsParams} />
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "var(--muted)" }}>
            {WATCHLIST_TABLE_HEADERS.map(({ label, align }) => (
              <th
                key={label || "actions"}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-${align}`}
                style={{ color: "var(--muted-foreground)" }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : symbols.length === 0 ? (
            <EmptyState />
          ) : (
            symbols.map((symbol, index) => (
                <StockRow
                  key={symbol}
                  symbol={symbol}
                  isSelected={selectedSymbol === symbol}
                  rsParams={apiParams}
                  isRSPending={isRSPending}
                  isDragOver={dragOverIndex === index}
                  onSelect={() => onSelect(symbol)}
                  onRemove={() => onRemove(symbol)}
                  onRSClick={handleRSClick}
                  onDragStart={handleDragStart(index)}
                  onDragOver={handleDragOver(index)}
                  onDragEnd={handleDragEnd}
                  onDrop={handleDrop(index)}
                />
            ))
          )}
        </tbody>
      </table>

      {rsModalSymbol && (
        <RSBreakdownModal
          symbol={rsModalSymbol}
          rsParams={apiParams}
          onClose={() => setRsModalSymbol(null)}
        />
      )}
    </div>
  );
}
