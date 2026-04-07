export interface RsiGaugeProps {
  value: number;
  size?: "sm" | "lg";
}

function getRsiColor(rsi: number): string {
  if (rsi >= 70) return "var(--bear)";
  if (rsi <= 30) return "var(--bull)";
  return "var(--neutral)";
}

export function RsiGauge({ value, size = "sm" }: RsiGaugeProps) {
  const color = getRsiColor(value);
  const pct = Math.min(100, Math.max(0, value));
  const isLg = size === "lg";

  if (isLg) {
    const radius = 40;
    const cx = 50;
    const cy = 55;
    const circumference = Math.PI * radius; // half circle
    const offset = circumference * (1 - pct / 100);

    return (
      <div className="flex flex-col items-center gap-1">
        <svg width="100" height="60" viewBox="0 0 100 60">
          <defs>
            <linearGradient id="rsi-gradient-lg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="var(--bull)" />
              <stop offset="50%"  stopColor="var(--neutral)" />
              <stop offset="100%" stopColor="var(--bear)" />
            </linearGradient>
          </defs>
          {/* Track */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="var(--border)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          {/* Fill */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="url(#rsi-gradient-lg)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${circumference}`}
            strokeDashoffset={`${offset}`}
          />
        </svg>
        <span
          className="font-numeric text-lg font-semibold"
          style={{ color, marginTop: -16 }}
        >
          {value.toFixed(1)}
        </span>
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>RSI</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ width: 48, background: "var(--border)" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="font-numeric text-xs" style={{ color }}>
        {value.toFixed(0)}
      </span>
    </div>
  );
}
