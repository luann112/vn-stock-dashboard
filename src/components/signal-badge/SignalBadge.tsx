import type { Signal } from "@/types";
import { SIGNAL_CONFIG } from "@/constants";

export interface SignalBadgeProps {
  signal: Signal;
}

const FALLBACK_CONFIG = { className: "badge-hold", label: "—" } as const;

export function SignalBadge({ signal }: SignalBadgeProps) {
  const key = signal.toUpperCase();
  const config = SIGNAL_CONFIG[key] ?? FALLBACK_CONFIG;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
