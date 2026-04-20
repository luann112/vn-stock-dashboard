"use client";

import { useState } from "react";

interface SliderFieldProps {
  label: string;
  description: string;
  tooltip: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (value: number) => void;
  disabled?: boolean;
  hasError?: boolean;
  errorText?: string;
}

const NUMBER_INPUT_STYLE: React.CSSProperties = {
  width: "60px",
  padding: "2px 6px",
  borderRadius: "8px",
  border: "1px solid var(--input-border)",
  backgroundColor: "var(--input)",
  color: "var(--foreground)",
  fontSize: "12px",
  textAlign: "right",
};

export function SliderField({
  label,
  description,
  tooltip,
  value,
  min,
  max,
  suffix,
  onChange,
  disabled = false,
  hasError = false,
  errorText,
}: SliderFieldProps) {
  const [draft, setDraft] = useState<string | null>(null);

  const handleRange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(e.target.value);
  };

  const commitDraft = () => {
    if (draft === null) return;
    const parsed = parseInt(draft, 10);
    if (!Number.isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, parsed));
      onChange(clamped);
    }
    setDraft(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitDraft();
      (e.target as HTMLInputElement).blur();
    }
  };

  const accentColor = hasError ? "var(--bear)" : "var(--primary)";

  return (
    <div title={tooltip}>
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-[color:var(--foreground)]">{label}</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={min}
            max={max}
            step={1}
            value={draft ?? value}
            onChange={handleNumberChange}
            onBlur={commitDraft}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            style={{
              ...NUMBER_INPUT_STYLE,
              borderColor: hasError ? "var(--bear)" : undefined,
            }}
            className="disabled:opacity-50"
          />
          {suffix && (
            <span className="text-xs text-[color:var(--muted-foreground)] whitespace-nowrap">
              {suffix}
            </span>
          )}
        </div>
      </div>
      <p className="text-xs text-[color:var(--muted-foreground)] mb-2">{description}</p>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleRange}
        disabled={disabled}
        style={{ accentColor }}
        className="w-full disabled:opacity-50"
      />
      <div className="text-xs text-[color:var(--muted-foreground)] mt-1">
        {min} – {max}
        {hasError && errorText && (
          <span className="text-[color:var(--bear)] ml-2">{errorText}</span>
        )}
      </div>
    </div>
  );
}
