import { HeatCell } from "@/components/heat-cell";

export interface MarketSectionProps {
  title: string;
  exchange: string;
  symbols: readonly string[];
}

export function MarketSection({ title, exchange, symbols }: MarketSectionProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-bold text-base" style={{ color: "var(--foreground)" }}>
          {title}
        </span>
        <span
          className="text-xs font-mono px-2 py-0.5 rounded"
          style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
        >
          {exchange}
        </span>
        <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          {symbols.length} mã
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {symbols.map((symbol) => (
          <HeatCell key={symbol} symbol={symbol} />
        ))}
      </div>
    </div>
  );
}
