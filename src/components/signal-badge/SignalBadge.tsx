import type { Signal } from "@/types";
import { SIGNAL_CONFIG } from "@/constants";

export interface SignalBadgeProps {
  signal: Signal;
}

export function SignalBadge({ signal }: SignalBadgeProps) {
  const config = SIGNAL_CONFIG[signal];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${config.className}`}
    >
      {config.label}
    </span>
  );
}
