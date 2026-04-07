"use client";

import { useState, useEffect } from "react";
import {
  DEFAULT_SYMBOLS,
  WATCHLIST_STORAGE_KEY,
} from "@/constants";

interface UseWatchlistReturn {
  symbols: string[];
  hydrated: boolean;
  add: (symbol: string) => void;
  remove: (symbol: string) => void;
}

export function useWatchlist(): UseWatchlistReturn {
  const [symbols, setSymbols] = useState<string[]>([...DEFAULT_SYMBOLS]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as unknown;
        if (Array.isArray(parsed)) setSymbols(parsed as string[]);
      }
    } catch {
      // ignore parse errors — keep default
    }
    setHydrated(true);
  }, []);

  function save(next: string[]): void {
    setSymbols(next);
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(next));
  }

  function add(symbol: string): void {
    if (!symbols.includes(symbol)) save([...symbols, symbol]);
  }

  function remove(symbol: string): void {
    save(symbols.filter((s) => s !== symbol));
  }

  return { symbols, hydrated, add, remove };
}
