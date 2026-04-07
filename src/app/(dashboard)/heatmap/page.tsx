"use client";

import { Activity, RefreshCw } from "lucide-react";
import { HOSE_SYMBOLS, HNX_SYMBOLS, HEATMAP_LEGEND_ITEMS } from "@/constants";
import { MarketSection } from "@/components/market-section";

export default function HeatmapPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: "var(--muted)" }}
          >
            <Activity size={18} style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--foreground)" }}>
              Heatmap thị trường
            </h1>
            <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
              Màu sắc theo % thay đổi giá ngày
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--muted-foreground)" }}>
          <RefreshCw size={12} />
          <span>30 giây</span>
        </div>
      </div>

      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg mb-6 flex-wrap"
        style={{ background: "var(--muted)" }}
      >
        <span className="text-xs font-medium" style={{ color: "var(--muted-foreground)" }}>
          Chú giải:
        </span>
        {HEATMAP_LEGEND_ITEMS.map(({ cssVar, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: cssVar }} />
            <span className="text-xs" style={{ color: "var(--foreground)" }}>{label}</span>
          </div>
        ))}
      </div>

      <MarketSection title="HOSE — Sàn TP.HCM" exchange="HOSE" symbols={HOSE_SYMBOLS} />
      <MarketSection title="HNX — Sàn Hà Nội"  exchange="HNX"  symbols={HNX_SYMBOLS} />
    </div>
  );
}
