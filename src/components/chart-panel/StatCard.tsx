export interface StatCardProps {
  label: string;
  value: string;
  color?: string;
}

export function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div
      className="rounded-lg p-3 text-center"
      style={{ background: "var(--muted)" }}
    >
      <div className="text-xs mb-1" style={{ color: "var(--muted-foreground)" }}>
        {label}
      </div>
      <div
        className="font-mono font-semibold text-sm"
        style={{ color: color ?? "var(--foreground)" }}
      >
        {value}
      </div>
    </div>
  );
}
