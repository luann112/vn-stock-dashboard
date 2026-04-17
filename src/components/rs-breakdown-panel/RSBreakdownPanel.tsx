"use client";

import {
  RS_SIGNAL_CONFIG,
  LOOKBACK_LABELS,
  RS_RATING_THRESHOLDS,
  RS_NEAR_HIGH_THRESHOLDS,
  RS_DAYS_THRESHOLDS,
} from "@/constants";
import { RS_TOOLTIPS } from "@/constants/rs-tooltips";
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

  const scoreColor = score >= 80 ? "var(--bull)" : score >= 50 ? "var(--signal-hold)" : "var(--bear)";

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
          className="relative flex h-24 w-24 flex-none items-center justify-center rounded-full"
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: scoreColor, opacity: 0.15 }}
          />
          <div className="relative text-center">
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
          tooltipContent={RS_TOOLTIPS.rating}
          description={`Cổ phiếu đang outperform bao nhiêu % thị trường trong kỳ ${lookbackLabel}?`}
          thresholds={{
            segments: [...RS_RATING_THRESHOLDS],
            current: breakdown.rs_rating_raw,
          }}
          subtitle={`Percentile ${Math.round(breakdown.rs_rating_raw)}/100`}
          formula={`${Math.round(breakdown.rs_rating_raw)}/100 × 0.40 = ${Math.round(breakdown.rs_rating)}đ`}
          extra={`${Math.round(breakdown.rs_rating)}/${40}`}
        />

        <ComponentBar
          label="RS Trending"
          weight="20%"
          score={breakdown.rs_trending}
          maxScore={20}
          tooltipContent={RS_TOOLTIPS.trending}
          description={`RS Line (giá/VN-Index) đang đi lên hay xuống trong ${params.slope_window} phiên?`}
          subtitle={binaryUp ? "▲ Đang outperform" : "▼ Đang underperform"}
          subtitleColor={binaryUp ? "var(--bull)" : "var(--bear)"}
          extra={breakdown.rs_trending === 20 ? "20" : "0"}
          formula={binaryUp ? "slope dương → 20đ" : "slope âm → 0đ"}
          note="Không có điểm giữa — slope dương = 20đ, slope âm = 0đ"
          isBinary
          isBinaryUp={binaryUp}
        />

        <ComponentBar
          label="RS Near High"
          weight="20%"
          score={breakdown.rs_near_high}
          maxScore={20}
          tooltipContent={RS_TOOLTIPS.nearHigh}
          description={`RS Line hiện tại ở bao nhiêu % so với đỉnh cao nhất trong ${lookbackLabel}?`}
          thresholds={{
            segments: [...RS_NEAR_HIGH_THRESHOLDS],
            current: breakdown.rs_near_high_pct * 100,
          }}
          subtitle={`${Math.round(breakdown.rs_near_high_pct * 100)}% of ${lookbackLabel} high`}
          formula={`${Math.round(breakdown.rs_near_high_pct * 100)}% × 20 = ${Math.round(breakdown.rs_near_high)}đ`}
          extra={`${Math.round(breakdown.rs_near_high)}/${20}`}
          note="RS Line phá đỉnh trước giá = tín hiệu tổ chức tích lũy"
        />

        <ComponentBar
          label="RS Days"
          weight="20%"
          score={breakdown.rs_days}
          maxScore={20}
          tooltipContent={RS_TOOLTIPS.days}
          description={`Khi VN-Index giảm, cổ phiếu có giảm ít hơn không? (${params.correction_window} phiên)`}
          thresholds={{
            segments: [...RS_DAYS_THRESHOLDS],
            current: breakdown.rs_days_pct * 100,
          }}
          subtitle={`${breakdown.rs_days_outperform}/${breakdown.rs_days_total} phiên outperform (${Math.round(breakdown.rs_days_pct * 100)}%)`}
          formula={`${Math.round(breakdown.rs_days_pct * 100)}% × 20 = ${Math.round(breakdown.rs_days)}đ`}
          extra={`${Math.round(breakdown.rs_days)}/${20}`}
          badge={{ text: "Leadership zone", show: breakdown.rs_days_pct > 0.6 }}
          note="Ngưỡng > 60% theo IBD/O'Neil"
        />
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
        <p>Score = RS Rating (40%) + RS Trending (20%) + RS Near High (20%) + RS Days (20%)</p>
        <p>Đây là công cụ lọc, không phải tín hiệu mua. Kết hợp với price action và market regime.</p>
        <p>Kiểm tra: VN-Index {"> "}MA50 {"> "}MA200 trước khi hành động.</p>
      </div>
    </div>
  );
}
