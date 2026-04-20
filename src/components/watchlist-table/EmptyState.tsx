import { Bot } from "lucide-react";

export function EmptyState() {
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
