"use client";

import { useEffect, useRef } from "react";
import { useRSScore } from "@/hooks/useRSScore";
import { getCompanyName } from "@/lib/api";
import type { RSParams } from "@/types";
import { RSBreakdownPanel } from "./RSBreakdownPanel";

interface RSBreakdownModalProps {
  symbol: string;
  rsParams?: Partial<RSParams>;
  onClose: () => void;
}

export function RSBreakdownModal({ symbol, rsParams, onClose }: RSBreakdownModalProps) {
  const { data, isLoading } = useRSScore(symbol, rsParams);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const handleBackdrop = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  const companyName = getCompanyName(symbol);

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div
        className="flex w-full max-w-lg max-h-[85vh] flex-col rounded-2xl border shadow-lg overflow-hidden"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-none"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h3 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
              {symbol}
            </h3>
            {companyName !== symbol && (
              <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                {companyName}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 transition-colors hover:bg-[color:var(--muted)]"
            style={{ color: "var(--muted-foreground)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-6">
          {isLoading && !data ? (
            <div className="flex items-center justify-center py-12">
              <div
                className="h-8 w-8 animate-spin rounded-full border-2"
                style={{
                  borderColor: "var(--muted)",
                  borderTopColor: "var(--primary)",
                }}
              />
            </div>
          ) : data ? (
            <RSBreakdownPanel data={data} />
          ) : (
            <p className="py-12 text-center text-sm" style={{ color: "var(--muted-foreground)" }}>
              Không có dữ liệu RS cho {symbol}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
