"use client";

import { RS_SIGNAL_CONFIG, LOOKBACK_LABELS } from "@/constants";
import type { RSScoreData } from "@/types";
import { ComponentBar } from "./ComponentBar";

export interface RSBreakdownPanelProps {
  data: RSScoreData;
}

export function RSBreakdownPanel({ data }: RSBreakdownPanelProps) {
  const { score, signal, breakdown, params } = data;
  const fallback = { className: "", label: "Average", color: "var(--muted-foreground)" };
  const signalConfig = RS_SIGNAL_CONFIG[signal] ?? fallback;
  const lookbackLabel = LOOKBACK_LABELS[params.lookback] ?? `${params.lookback} phiên`;

  const scorePercentage = (score / 100) * 100;
  let scoreColor = "var(--bear)";
  if (scorePercentage >= 80) {
    scoreColor = "var(--bull)";
  } else if (scorePercentage >= 50) {
    scoreColor = "var(--signal-hold)";
  }

  const binaryUp = breakdown.rs_trending_direction === "up";

  return (
    <div
      className="card-glass flex flex-col gap-6 rounded-2xl border p-6"
      style={{
        backgroundColor: "var(--card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Header: Score Circle + Signal */}
      <div className="flex items-center gap-6">
        <div
          className="flex h-24 w-24 flex-none items-center justify-center rounded-full"
          style={{
            backgroundColor: scoreColor,
            opacity: 0.15,
          }}
        >
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: scoreColor }}>
              {Math.round(score)}
            </div>
            <div className="text-xs text-muted-foreground">/100</div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div
            className="text-lg font-semibold"
            style={{ color: scoreColor }}
          >
            {signalConfig.label}
          </div>
          <div className="text-sm text-muted-foreground">
            Relative Strength Score
          </div>
          <div className="text-xs text-muted-foreground">
            {lookbackLabel} lookback
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className="h-px"
        style={{
          backgroundColor: "var(--border)",
        }}
      />

      {/* Components */}
      <div className="flex flex-col gap-6">
        <ComponentBar
          label="RS Rating"
          weight="40%"
          score={breakdown.rs_rating}
          maxScore={40}
          subtitle="Percentile vs index"
          extra={`${Math.round(breakdown.rs_rating)}/${40}`}
        />

        <ComponentBar
          label="RS Trending"
          weight="20%"
          score={breakdown.rs_trending}
          maxScore={20}
          subtitle={binaryUp ? "▲ Đang outperform" : "▼ Đang underperform"}
          extra={breakdown.rs_trending === 20 ? "20" : "0"}
          isBinary
          isBinaryUp={binaryUp}
        />

        <ComponentBar
          label="RS Near High"
          weight="20%"
          score={breakdown.rs_near_high}
          maxScore={20}
          subtitle={`${Math.round(breakdown.rs_near_high_pct * 100)}% of 52-week high`}
          extra={`${Math.round(breakdown.rs_near_high)}/${20}`}
        />

        <ComponentBar
          label="RS Days"
          weight="20%"
          score={breakdown.rs_days}
          maxScore={20}
          subtitle={`${breakdown.rs_days_outperform} of ${breakdown.rs_days_total} days outperform`}
          extra={`${Math.round(breakdown.rs_days)}/${20}`}
        />
      </div>

      {/* Footer Disclaimer */}
      <div className="text-xs text-muted-foreground">
        <p>
          RS Composite Score compares stock performance vs market index across 4 dimensions:
          rating, trend, proximity to highs, and outperformance days. Higher scores indicate
          stronger relative strength.
        </p>
      </div>
    </div>
  );
}
