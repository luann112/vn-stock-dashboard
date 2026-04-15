"use client";

interface ComponentBarProps {
  label: string;
  weight: string;
  score: number;
  maxScore: number;
  subtitle: string;
  extra?: string;
  isBinary?: boolean;
  isBinaryUp?: boolean;
}

export function ComponentBar({
  label,
  weight,
  score,
  maxScore,
  subtitle,
  extra,
  isBinary = false,
  isBinaryUp = false,
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
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-xs text-muted-foreground">{weight}</span>
      </div>

      <div
        className="h-2 rounded-full"
        style={{
          background: barGradient,
        }}
      />

      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-muted-foreground">{subtitle}</span>
        {extra && <span className="text-xs font-semibold text-foreground">{extra}</span>}
      </div>
    </div>
  );
}
