"use client";

import { RSComponentTooltip } from "./RSComponentTooltip";

export interface ThresholdSegment {
  max: number;
  label: string;
}

interface ComponentBarProps {
  label: string;
  weight: string;
  score: number;
  maxScore: number;
  subtitle: string;
  subtitleColor?: string;
  extra?: string;
  description?: string;
  thresholds?: { segments: ThresholdSegment[]; current: number };
  formula?: string;
  note?: string;
  badge?: { text: string; show: boolean };
  isBinary?: boolean;
  isBinaryUp?: boolean;
  tooltipContent?: string;
}

function thresholdColor(current: number, segments: ThresholdSegment[]): string {
  const total = segments.length;
  for (let i = 0; i < total; i++) {
    const seg = segments[i];
    if (!seg) continue;
    if (current < seg.max) {
      return i < total / 3 ? "var(--bear)" : "var(--signal-hold)";
    }
  }
  return "var(--bull)";
}

export function ComponentBar({
  label,
  weight,
  score,
  maxScore,
  subtitle,
  subtitleColor,
  extra,
  description,
  thresholds,
  formula,
  note,
  badge,
  isBinary = false,
  isBinaryUp = false,
  tooltipContent,
}: ComponentBarProps) {
  const percentage = isBinary ? (isBinaryUp ? 100 : 0) : (score / maxScore) * 100;

  let barColor = "var(--bear)";
  if (percentage >= 80) {
    barColor = "var(--bull)";
  } else if (percentage >= 50) {
    barColor = "var(--signal-hold)";
  }

  const barGradient = `linear-gradient(to right, ${barColor} 0%, ${barColor} ${percentage}%, var(--muted) ${percentage}%, var(--muted) 100%)`;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          {label}
          {tooltipContent && <RSComponentTooltip content={tooltipContent} />}
        </span>
        <span className="text-xs text-muted-foreground">{weight}</span>
      </div>

      {description && (
        <p className="text-xs text-muted-foreground" style={{ marginTop: "-4px" }}>
          {description}
        </p>
      )}

      <div
        className="h-2 rounded-full"
        style={{
          background: barGradient,
          border: "1px solid var(--border)",
        }}
      />

      {thresholds && (
        <div className="flex gap-2" style={{ marginTop: "-2px" }}>
          {thresholds.segments.map((seg) => {
            const isActive =
              thresholds.current < seg.max &&
              (thresholds.segments.indexOf(seg) === 0 ||
                thresholds.current >=
                  (thresholds.segments[thresholds.segments.indexOf(seg) - 1]?.max ?? 0));
            const color = isActive ? thresholdColor(thresholds.current, thresholds.segments) : undefined;
            return (
              <span
                key={seg.label}
                className="text-muted-foreground"
                style={{
                  fontSize: "10px",
                  lineHeight: "14px",
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? color : undefined,
                }}
              >
                {seg.label}
              </span>
            );
          })}
        </div>
      )}

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-muted-foreground" style={subtitleColor ? { color: subtitleColor } : undefined}>
          {subtitle}
        </span>
        <div className="flex items-center gap-2">
          {badge?.show && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-semibold"
              style={{
                backgroundColor: "var(--bull-muted)",
                color: "var(--bull-foreground)",
                fontSize: "10px",
              }}
            >
              {badge.text}
            </span>
          )}
          {extra && <span className="text-xs font-semibold text-foreground">{extra}</span>}
        </div>
      </div>

      {formula && (
        <p
          className="font-mono text-muted-foreground"
          style={{ fontSize: "11px", lineHeight: "16px", marginTop: "-2px" }}
        >
          {formula}
        </p>
      )}

      {note && (
        <p
          className="text-muted-foreground italic"
          style={{ fontSize: "10px", lineHeight: "14px", marginTop: "-2px" }}
        >
          {note}
        </p>
      )}
    </div>
  );
}
