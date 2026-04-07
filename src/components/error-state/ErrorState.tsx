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
          className="text-xs px-3 py-1.5 rounded-md transition-colors"
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
