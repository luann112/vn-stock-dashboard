"use client";

import { useState } from "react";
import { RS_DEFAULT_PARAMS } from "@/constants";
import type { RSParams } from "@/types";
import { RS_PRESETS, detectPreset, sessionsToLabel } from "./rs-presets";
import { ParamCustomModal } from "./ParamCustomModal";
import { ParamHelpModal } from "./ParamHelpModal";

export interface RSParamSelectorProps {
  value: Partial<RSParams>;
  onChange: (params: Partial<RSParams>) => void;
}

export function RSParamSelector({ value, onChange }: RSParamSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const lookback = value.lookback ?? RS_DEFAULT_PARAMS.lookback;
  const slopeWindow = value.slope_window ?? RS_DEFAULT_PARAMS.slope_window;
  const correctionWindow = value.correction_window ?? RS_DEFAULT_PARAMS.correction_window;

  const currentPreset = detectPreset(value);
  const isCustom = currentPreset === null;
  const presetName = isCustom
    ? "Tuỳ chỉnh"
    : RS_PRESETS[currentPreset]?.name ?? "Tuỳ chỉnh";

  const isInvalid = slopeWindow > lookback || correctionWindow > lookback;

  const handlePreset = (presetKey: string) => {
    const preset = RS_PRESETS[presetKey];
    if (preset) {
      onChange({ ...preset.params, preset: presetKey });
    }
  };

  const handleSlider = (key: keyof RSParams) => (val: number) => {
    onChange({ [key]: val });
  };

  if (!isExpanded) {
    return (
      <div className="inline-flex items-center gap-2 rounded-lg px-3 py-2 bg-[color:var(--muted)]">
        <span className="text-sm text-[color:var(--muted-foreground)]">
          {presetName}
          <span className="ml-1 opacity-60">· {lookback}/{slopeWindow}/{correctionWindow}</span>
        </span>
        <button
          onClick={() => setIsExpanded(true)}
          className="rounded-lg p-1 transition-colors hover:bg-[color:var(--input-border)]"
          title="Mở rộng"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="5" cy="12" r="1" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-3 rounded-xl border p-4 bg-[color:var(--card)] border-[color:var(--border)]">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[color:var(--foreground)]">RS Params</h3>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-xs transition-colors text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
          >
            Đóng
          </button>
        </div>

        {/* Presets + Tuỳ chỉnh button */}
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(RS_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => handlePreset(key)}
              title={preset.tooltip}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                currentPreset === key
                  ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
                  : "bg-[color:var(--muted)] text-[color:var(--muted-foreground)] hover:bg-[color:var(--input-border)]"
              }`}
            >
              {preset.name}
            </button>
          ))}
          <button
            onClick={() => setShowCustom(true)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              isCustom
                ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
                : "bg-[color:var(--muted)] text-[color:var(--muted-foreground)] hover:bg-[color:var(--input-border)]"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Tuỳ chỉnh
          </button>
        </div>

        {/* Params summary + help button */}
        <div className="flex items-center gap-2">
          <p className="text-xs text-[color:var(--muted-foreground)]">
            Đang dùng: lookback={lookback} · slope={slopeWindow} · correction={correctionWindow}
          </p>
          <button
            onClick={() => setShowHelp(true)}
            title="Giải thích tham số"
            className="flex h-5 w-5 flex-none items-center justify-center rounded-full text-xs font-semibold transition-colors bg-[color:var(--muted)] text-[color:var(--muted-foreground)] hover:bg-[color:var(--input-border)]"
          >
            ?
          </button>
        </div>
      </div>

      {showCustom && (
        <ParamCustomModal
          lookback={lookback}
          slopeWindow={slopeWindow}
          correctionWindow={correctionWindow}
          isInvalid={isInvalid}
          onChange={handleSlider}
          sessionsToLabel={sessionsToLabel}
          onClose={() => setShowCustom(false)}
        />
      )}

      {showHelp && <ParamHelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
}
