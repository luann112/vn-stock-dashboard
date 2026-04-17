"use client";

import { useEffect, useRef } from "react";
import { RS_PARAM_BOUNDS } from "@/constants";
import type { RSParams } from "@/types";
import { SliderField } from "./SliderField";

interface ParamCustomModalProps {
  lookback: number;
  slopeWindow: number;
  correctionWindow: number;
  isInvalid: boolean;
  onChange: (key: keyof RSParams) => (val: number) => void;
  sessionsToLabel: (sessions: number) => string;
  onClose: () => void;
}

export function ParamCustomModal({
  lookback,
  slopeWindow,
  correctionWindow,
  isInvalid,
  onChange,
  sessionsToLabel,
  onClose,
}: ParamCustomModalProps) {
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

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="flex w-full max-w-md flex-col gap-5 rounded-2xl border p-6 shadow-lg"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
            Tuỳ chỉnh tham số RS
          </h3>
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

        <div className="flex flex-col gap-5">
          <SliderField
            label="Lookback"
            description="Ảnh hưởng RS Rating và RS Near High"
            tooltip="Ngắn = bắt momentum sớm, nhiều nhiễu. Dài = ổn định, chậm hơn"
            value={lookback}
            min={RS_PARAM_BOUNDS.lookback.min}
            max={RS_PARAM_BOUNDS.lookback.max}
            suffix={sessionsToLabel(lookback)}
            onChange={onChange("lookback")}
            hasError={isInvalid}
          />
          <SliderField
            label="Slope Window"
            description="Ảnh hưởng RS Trending — slope dương/âm của RS Line"
            tooltip="Nhỏ = nhạy nhưng dễ bị nhiễu 1–2 phiên xấu. Khuyến nghị: 5–10"
            value={slopeWindow}
            min={RS_PARAM_BOUNDS.slope_window.min}
            max={RS_PARAM_BOUNDS.slope_window.max}
            onChange={onChange("slope_window")}
            disabled={isInvalid}
            hasError={isInvalid}
            errorText={`(ph\u1ea3i \u2264 Lookback)`}
          />
          <SliderField
            label="Correction Window"
            description="Ảnh hưởng RS Days — số phiên quan sát khi thị trường giảm"
            tooltip="Nhỏ = phản ánh hành vi rất gần đây. Khuyến nghị: 60"
            value={correctionWindow}
            min={RS_PARAM_BOUNDS.correction_window.min}
            max={RS_PARAM_BOUNDS.correction_window.max}
            onChange={onChange("correction_window")}
            disabled={isInvalid}
            hasError={isInvalid}
            errorText={`(ph\u1ea3i \u2264 Lookback)`}
          />
        </div>

        <button
          onClick={onClose}
          className="btn-primary w-full rounded-lg py-2.5 text-sm font-medium"
        >
          Áp dụng
        </button>
      </div>
    </div>
  );
}
