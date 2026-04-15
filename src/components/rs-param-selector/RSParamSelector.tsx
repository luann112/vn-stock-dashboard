"use client";

import { useState } from "react";
import { RS_DEFAULT_PARAMS, RS_PARAM_BOUNDS } from "@/constants";
import type { RSParams } from "@/types";

export interface RSParamSelectorProps {
  value: Partial<RSParams>;
  onChange: (params: Partial<RSParams>) => void;
}

function sessionsToLabel(sessions: number): string {
  if (sessions <= 21) return `${sessions} phiên ≈ 1 tháng`;
  const months = Math.round(sessions / 21);
  if (months <= 12) return `${sessions} phiên ≈ ${months} tháng`;
  const years = (sessions / 252).toFixed(1);
  return `${sessions} phiên ≈ ${years} năm`;
}

const PRESETS = {
  conservative: {
    name: "Thận trọng (1 năm)",
    params: { lookback: 252, slope_window: 10, correction_window: 60 },
  },
  balanced: {
    name: "Cân bằng (6 tháng)",
    params: { lookback: 126, slope_window: 10, correction_window: 45 },
  },
  aggressive: {
    name: "Nhạy (3 tháng)",
    params: { lookback: 63, slope_window: 5, correction_window: 30 },
  },
};

function detectPreset(params: Partial<RSParams>): string | null {
  for (const [key, preset] of Object.entries(PRESETS)) {
    const p = preset.params;
    if (
      params.lookback === p.lookback &&
      params.slope_window === p.slope_window &&
      params.correction_window === p.correction_window
    ) {
      return key;
    }
  }
  return null;
}

export function RSParamSelector({ value, onChange }: RSParamSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCustom, setIsCustom] = useState(false);

  const lookback = value.lookback ?? RS_DEFAULT_PARAMS.lookback;
  const slopeWindow = value.slope_window ?? RS_DEFAULT_PARAMS.slope_window;
  const correctionWindow = value.correction_window ?? RS_DEFAULT_PARAMS.correction_window;

  const currentPreset = detectPreset(value);
  const presetName =
    currentPreset && !isCustom
      ? PRESETS[currentPreset as keyof typeof PRESETS]?.name ?? "Tuỳ chỉnh"
      : "Tuỳ chỉnh";

  const isInvalid = slopeWindow > lookback || correctionWindow > lookback;

  const handlePreset = (presetKey: string) => {
    const preset = PRESETS[presetKey as keyof typeof PRESETS];
    if (preset) {
      onChange({
        ...preset.params,
        preset: presetKey,
      });
      setIsCustom(false);
    }
  };

  const handleLookback = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    onChange({ lookback: val });
    setIsCustom(true);
  };

  const handleSlopeWindow = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    onChange({ slope_window: val });
    setIsCustom(true);
  };

  const handleCorrectionWindow = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    onChange({ correction_window: val });
    setIsCustom(true);
  };

  if (!isExpanded) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-[color:var(--muted)]">
        <span className="text-sm text-[color:var(--muted-foreground)]">{presetName}</span>
        <button
          onClick={() => setIsExpanded(true)}
          className="p-1 hover:bg-[color:var(--input-border)] rounded transition-colors"
          title="Mở rộng"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg bg-[color:var(--card)] border border-[color:var(--border)]">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[color:var(--foreground)]">RS Params</h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-xs text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
        >
          Đóng
        </button>
      </div>

      <div className="flex gap-2">
        {Object.entries(PRESETS).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => handlePreset(key)}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
              currentPreset === key && !isCustom
                ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
                : "bg-[color:var(--muted)] text-[color:var(--muted-foreground)] hover:bg-[color:var(--input-border)]"
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isCustom}
          onChange={(e) => setIsCustom(e.target.checked)}
          className="w-4 h-4"
        />
        <span className="text-sm text-[color:var(--foreground)]">Tuỳ chỉnh</span>
      </label>

      {isCustom && (
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm font-medium text-[color:var(--foreground)]">
                Lookback
              </label>
              <span className="text-xs text-[color:var(--muted-foreground)]">
                {sessionsToLabel(lookback)}
              </span>
            </div>
            <input
              type="range"
              min={RS_PARAM_BOUNDS.lookback.min}
              max={RS_PARAM_BOUNDS.lookback.max}
              value={lookback}
              onChange={handleLookback}
              style={{
                accentColor: isInvalid ? "var(--bear)" : "var(--primary)",
              }}
              className="w-full"
            />
            <div className="text-xs text-[color:var(--muted-foreground)] mt-1">
              {RS_PARAM_BOUNDS.lookback.min} – {RS_PARAM_BOUNDS.lookback.max}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm font-medium text-[color:var(--foreground)]">
                Slope Window
              </label>
              <span className="text-xs text-[color:var(--muted-foreground)]">{slopeWindow}</span>
            </div>
            <input
              type="range"
              min={RS_PARAM_BOUNDS.slope_window.min}
              max={RS_PARAM_BOUNDS.slope_window.max}
              value={slopeWindow}
              onChange={handleSlopeWindow}
              disabled={isInvalid}
              style={{
                accentColor: isInvalid ? "var(--bear)" : "var(--primary)",
              }}
              className="w-full disabled:opacity-50"
            />
            <div className="text-xs text-[color:var(--muted-foreground)] mt-1">
              {RS_PARAM_BOUNDS.slope_window.min} – {RS_PARAM_BOUNDS.slope_window.max}
              {isInvalid && (
                <span className="text-[color:var(--bear)] ml-2">
                  (phải {String.fromCharCode(8804)} Lookback)
                </span>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-sm font-medium text-[color:var(--foreground)]">
                Correction Window
              </label>
              <span className="text-xs text-[color:var(--muted-foreground)]">
                {correctionWindow}
              </span>
            </div>
            <input
              type="range"
              min={RS_PARAM_BOUNDS.correction_window.min}
              max={RS_PARAM_BOUNDS.correction_window.max}
              value={correctionWindow}
              onChange={handleCorrectionWindow}
              disabled={isInvalid}
              style={{
                accentColor: isInvalid ? "var(--bear)" : "var(--primary)",
              }}
              className="w-full disabled:opacity-50"
            />
            <div className="text-xs text-[color:var(--muted-foreground)] mt-1">
              {RS_PARAM_BOUNDS.correction_window.min} – {RS_PARAM_BOUNDS.correction_window.max}
              {isInvalid && (
                <span className="text-[color:var(--bear)] ml-2">
                  (phải {String.fromCharCode(8804)} Lookback)
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
