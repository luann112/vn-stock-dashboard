import { AlertCircle } from "lucide-react";

export interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-lg p-6"
      style={{ background: "var(--muted)" }}
    >
      <AlertCircle size={24} style={{ color: "var(--bear)" }} />
      <p className="text-sm text-center" style={{ color: "var(--muted-foreground)" }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm font-medium px-4 py-2 rounded-lg shadow-xs transition-colors"
          style={{
            background: "var(--secondary)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          }}
        >
          Thử lại
        </button>
      )}
    </div>
  );
}
