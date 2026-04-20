import type { ThresholdSegment } from "./ComponentBar";

interface ThresholdSegmentsProps {
  segments: ThresholdSegment[];
  current: number;
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

export function ThresholdSegments({ segments, current }: ThresholdSegmentsProps) {
  return (
    <div className="flex gap-2" style={{ marginTop: "-2px" }}>
      {segments.map((seg) => {
        const isActive =
          current < seg.max &&
          (segments.indexOf(seg) === 0 ||
            current >= (segments[segments.indexOf(seg) - 1]?.max ?? 0));
        const color = isActive ? thresholdColor(current, segments) : undefined;
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
  );
}
