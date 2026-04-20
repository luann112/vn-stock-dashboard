"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { Bell, Filter, RefreshCw } from "lucide-react";
import type { Signal } from "@/types";
import { HOSE_SYMBOLS, HNX_SYMBOLS, ALERT_FILTER_OPTIONS, ALERT_TABLE_HEADERS } from "@/constants";
import { AlertRow } from "@/components/alert-row";

type FilterOption = Signal | "ALL";

const ALERT_SYMBOLS = [...HOSE_SYMBOLS, ...HNX_SYMBOLS] as const;
const VALID_FILTERS = new Set<string>(["ALL", "BUY", "SELL", "HOLD"]);

export function AlertsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawFilter = searchParams.get("filter") ?? "ALL";
  const filter: FilterOption = VALID_FILTERS.has(rawFilter) ? (rawFilter as FilterOption) : "ALL";

  const setFilter = useCallback(
    (value: FilterOption) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "ALL") {
        params.delete("filter");
      } else {
        params.set("filter", value);
      }
      const qs = params.toString();
      router.replace(qs ? `?${qs}` : "/alerts", { scroll: false });
    },
    [searchParams, router]
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "var(--muted)" }}
          >
            <Bell size={18} style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              Trung tâm cảnh báo
            </h1>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Tín hiệu BUY / SELL / HOLD từ bot phân tích
            </p>
          </div>
        </div>
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: "var(--muted-foreground)" }}
        >
          <RefreshCw size={12} />
          <span>Cập nhật 30s</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Filter size={14} style={{ color: "var(--muted-foreground)" }} />
        <span className="text-sm" style={{ color: "var(--muted-foreground)" }}>
          Lọc:
        </span>
        {ALERT_FILTER_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value as FilterOption)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: filter === value ? "var(--primary)" : "var(--muted)",
              color: filter === value ? "var(--primary-foreground)" : "var(--muted-foreground)",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        className="rounded-xl border overflow-hidden card-surface"
        style={{ borderColor: "var(--border)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--muted)" }}>
              {ALERT_TABLE_HEADERS.map((h) => (
                <th
                  key={h}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-left ${
                    h === "Giá" || h === "RSI" ? "text-right" : ""
                  }`}
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {ALERT_SYMBOLS.map((symbol) => (
              <AlertRow key={symbol} symbol={symbol} filter={filter} />
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs mt-4 text-center" style={{ color: "var(--muted-foreground)" }}>
        Dữ liệu từ{" "}
        <code className="font-mono px-1 py-0.5 rounded" style={{ background: "var(--muted)" }}>
          /api/signals/&#123;symbol&#125;
        </code>{" "}
        · RSI(14) · MA20 · MA50
      </p>
    </div>
  );
}
