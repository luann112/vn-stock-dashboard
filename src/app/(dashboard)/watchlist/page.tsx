"use client";

import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { WatchlistTable } from "@/components/watchlist-table";
import { ChartPanel } from "@/components/chart-panel";
import { AddSymbolDialog } from "@/components/add-symbol-dialog";
import { REFRESH_INTERVAL } from "@/constants";

export default function WatchlistPage() {
  const { symbols, hydrated, add, remove } = useWatchlist();
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  useEffect(() => {
    setLastRefresh(new Date());
    const interval = setInterval(() => setLastRefresh(new Date()), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  function handleSelect(symbol: string): void {
    setSelectedSymbol((prev) => (prev === symbol ? null : symbol));
  }

  function handleRemove(symbol: string): void {
    remove(symbol);
    if (selectedSymbol === symbol) setSelectedSymbol(null);
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

      <WatchlistTable
        symbols={symbols}
        selectedSymbol={selectedSymbol}
        isLoading={!hydrated}
        onSelect={handleSelect}
        onRemove={handleRemove}
      />

      {selectedSymbol && (
        <ChartPanel symbol={selectedSymbol} onClose={() => setSelectedSymbol(null)} />
      )}
    </div>
  );
}
