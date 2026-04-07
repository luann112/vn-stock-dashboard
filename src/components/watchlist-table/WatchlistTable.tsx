import { Bot } from "lucide-react";
import { StockRow } from "@/components/stock-row";
import { SkeletonRow } from "@/components/skeleton";
import { WATCHLIST_TABLE_HEADERS } from "@/constants";

export interface WatchlistTableProps {
  symbols: string[];
  selectedSymbol: string | null;
  isLoading?: boolean;
  onSelect: (symbol: string) => void;
  onRemove: (symbol: string) => void;
}

function EmptyState() {
  return (
    <tr>
      <td colSpan={7} className="px-4 py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: "var(--muted)" }}
          >
            <Bot size={24} style={{ color: "var(--muted-foreground)" }} />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>
              Danh mục trống
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
              Thêm mã bằng nút &ldquo;Thêm mã&rdquo; bên trên,
            </p>
            <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
              hoặc gửi lệnh <code className="font-mono">/watchlist</code> cho Telegram bot.
            </p>
          </div>
        </div>
      </td>
    </tr>
  );
}

export function WatchlistTable({
  symbols,
  selectedSymbol,
  isLoading = false,
  onSelect,
  onRemove,
}: WatchlistTableProps) {
  return (
    <div
      className="rounded-xl border overflow-hidden card-glass"
      style={{ borderColor: "var(--border)" }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: "var(--muted)" }}>
            {WATCHLIST_TABLE_HEADERS.map(({ label, align }) => (
              <th
                key={label}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-${align}`}
                style={{ color: "var(--muted-foreground)" }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : symbols.length === 0 ? (
            <EmptyState />
          ) : (
            symbols.map((symbol) => (
              <StockRow
                key={symbol}
                symbol={symbol}
                isSelected={selectedSymbol === symbol}
                onSelect={() => onSelect(symbol)}
                onRemove={() => onRemove(symbol)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
