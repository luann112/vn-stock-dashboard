import { RSSignal } from "@/types";
import { RS_SIGNAL_CONFIG } from "@/constants";

export interface RSScoreBadgeProps {
  score: number;
  signal: RSSignal;
  isTrendingUp: boolean;
  onClick?: () => void;
}

export function RSScoreBadge({
  score,
  signal,
  isTrendingUp,
  onClick,
}: RSScoreBadgeProps) {
  const config = RS_SIGNAL_CONFIG[signal];
  if (!config) return null;
  const colorVar = config.color;
  const arrow = isTrendingUp ? "↑" : "↓";
  const cursorClass = onClick ? "cursor-pointer" : "";
  const hoverClass = onClick ? "hover:opacity-80 transition-opacity" : "";

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${cursorClass} ${hoverClass}`}
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
