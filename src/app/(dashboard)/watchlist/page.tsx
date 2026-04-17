"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { WatchlistTable } from "@/components/watchlist-table";
import { ChartPanel } from "@/components/chart-panel";
import { AddSymbolDialog } from "@/components/add-symbol-dialog";
import { REFRESH_INTERVAL, SELECTED_SYMBOL_KEY } from "@/constants";

export default function WatchlistPage() {
  const { symbols, hydrated, add, remove, reorder } = useWatchlist();
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Restore selected symbol from localStorage after hydration
  useEffect(() => {
    if (!hydrated || symbols.length === 0) return;
    const saved = localStorage.getItem(SELECTED_SYMBOL_KEY);
    if (saved && symbols.includes(saved)) {
      setSelectedSymbol(saved);
    } else {
      const first = symbols[0];
      if (first) setSelectedSymbol(first);
    }
  }, [hydrated, symbols.length === 0]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist selected symbol to localStorage
  useEffect(() => {
    if (selectedSymbol) {
      localStorage.setItem(SELECTED_SYMBOL_KEY, selectedSymbol);
    }
  }, [selectedSymbol]);

  useEffect(() => {
    setLastRefresh(new Date());
    const interval = setInterval(() => setLastRefresh(new Date()), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const activeSymbol = selectedSymbol ?? symbols[0] ?? null;

  function handleSelect(symbol: string): void {
    setSelectedSymbol((prev) => (prev === symbol ? null : symbol));
  }

  function handleRemove(symbol: string): void {
    remove(symbol);
    if (selectedSymbol === symbol) {
      const remaining = symbols.filter((s) => s !== symbol);
      const fallback = remaining[0] ?? null;
      setSelectedSymbol(fallback);
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
            Danh mục theo dõi
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--muted-foreground)" }}>
            {hydrated ? `${symbols.length} mã · Cập nhật mỗi 30 giây` : "Đang tải…"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1.5 text-xs"
            style={{ color: "var(--muted-foreground)" }}
          >
            <RefreshCw size={12} />
            <span>
              {lastRefresh
                ? lastRefresh.toLocaleTimeString("vi-VN", {
                    hour: "2-digit", minute: "2-digit", second: "2-digit",
                  })
                : "—"}
            </span>
          </div>
          <AddSymbolDialog onAdd={add} existing={symbols} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <div className="w-full lg:flex-1 min-w-0">
          <WatchlistTable
            symbols={symbols}
            selectedSymbol={selectedSymbol}
            isLoading={!hydrated}
            onSelect={handleSelect}
            onRemove={handleRemove}
            onReorder={reorder}
          />
        </div>

        {activeSymbol && (
          <div className="w-full lg:w-105 lg:shrink-0 lg:sticky lg:top-6 lg:self-start">
            <ChartPanel symbol={activeSymbol} onClose={() => setSelectedSymbol(null)} />
          </div>
        )}
      </div>
    </div>
  );
}
