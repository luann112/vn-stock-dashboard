import { RSSignal } from "@/types";
import { RS_SIGNAL_CONFIG } from "@/constants";

export interface RSScoreBadgeProps {
  score: number;
  signal: RSSignal;
  isTrendingUp: boolean;
  isPending?: boolean;
  onClick?: () => void;
}

export function RSScoreBadge({
  score,
  signal,
  isTrendingUp,
  isPending = false,
  onClick,
}: RSScoreBadgeProps) {
  const config = RS_SIGNAL_CONFIG[signal];
  if (!config) return null;
  const colorVar = config.color;
  const arrow = isTrendingUp ? "↑" : "↓";
  const cursorClass = onClick ? "cursor-pointer" : "";
  const hoverClass = onClick ? "hover:opacity-80 transition-opacity" : "";
  const pendingClass = isPending ? "animate-pulse opacity-50" : "";

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm font-medium ${cursorClass} ${hoverClass} ${pendingClass}`}
      style={{
        color: colorVar,
        backgroundColor: "var(--muted)",
      }}
    >
      <span>{Math.round(score)}</span>
      <span>{arrow}</span>
    </div>
  );
}
