"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { POPULAR_SYMBOLS } from "@/constants";

export interface AddSymbolDialogProps {
  onAdd: (symbol: string) => void;
  existing: string[];
}

export function AddSymbolDialog({ onAdd, existing }: AddSymbolDialogProps) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  function handleAdd(sym: string): void {
    const cleaned = sym.trim().toUpperCase();
    if (cleaned && !existing.includes(cleaned)) {
      onAdd(cleaned);
      setInput("");
      setOpen(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent): void {
    if (e.key === "Enter") handleAdd(input);
    if (e.key === "Escape") setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
      >
        <Plus size={16} />
        Thêm mã
      </button>
    );
  }

  const available = POPULAR_SYMBOLS.filter((s) => !existing.includes(s));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={() => setOpen(false)}
    >
      <div
        className="rounded-xl w-96 p-6"
        style={{
          background: "var(--card)",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-lg" style={{ color: "var(--foreground)" }}>
            Thêm mã chứng khoán
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded"
            style={{ color: "var(--muted-foreground)" }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            onKeyDown={handleKeyDown}
            placeholder="Nhập mã (VD: VNM)"
            maxLength={10}
            className="flex-1 px-3 py-2 rounded-lg text-sm font-mono outline-none border"
            style={{
              background: "var(--muted)",
              color: "var(--foreground)",
              borderColor: "var(--border)",
            }}
          />
          <button
            onClick={() => handleAdd(input)}
            disabled={!input.trim()}
            className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Thêm
          </button>
        </div>

        <div>
          <div className="text-xs font-medium mb-2" style={{ color: "var(--muted-foreground)" }}>
            Mã phổ biến
          </div>
          <div className="flex flex-wrap gap-2">
            {available.map((s) => (
              <button
                key={s}
                onClick={() => handleAdd(s)}
                className="px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors"
                style={{
                  background: "var(--muted)",
                  color: "var(--foreground)",
                  border: "1px solid var(--border)",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
