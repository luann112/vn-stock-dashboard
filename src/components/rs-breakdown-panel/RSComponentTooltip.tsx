"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Info, X } from "lucide-react";

export interface RSComponentTooltipProps {
  content: string;
}

export function RSComponentTooltip({ content }: RSComponentTooltipProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calcPosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return null;

    const PANEL_WIDTH = 280;
    const GAP = 8;

    let left = rect.left + rect.width / 2 - PANEL_WIDTH / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - PANEL_WIDTH - 12));

    const spaceAbove = rect.top;
    const estimatedHeight = 200;

    const top =
      spaceAbove > estimatedHeight + GAP
        ? rect.top - GAP
        : rect.bottom + GAP;

    return { top, left };
  }, []);

  const showTooltip = useCallback(() => {
    const newPos = calcPosition();
    if (!newPos) return;
    setPos(newPos);
    setOpen(true);
  }, [calcPosition]);

  const toggle = useCallback(() => {
    if (open) {
      setOpen(false);
      return;
    }
    showTooltip();
  }, [open, showTooltip]);

  const handleMouseEnter = useCallback(() => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    showTooltip();
  }, [showTooltip]);

  const handleMouseLeave = useCallback(() => {
    hoverTimeout.current = setTimeout(() => setOpen(false), 150);
  }, []);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  /* Recalc: scroll / resize while open */
  useEffect(() => {
    if (!open) return;

    function reposition() {
      const newPos = calcPosition();
      if (newPos) setPos(newPos);
    }

    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open, calcPosition]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-expanded={open}
        aria-label="Xem giải thích"
        className="inline-flex cursor-help items-center justify-center rounded-full p-0.5 transition-colors hover:bg-muted"
      >
        <Info size={12} style={{ color: "var(--muted-foreground)" }} />
      </button>

      {open && pos && (
        <div
          ref={panelRef}
          role="tooltip"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="fixed z-[9999] w-[280px] whitespace-pre-line rounded-xl border px-4 py-3 text-xs leading-relaxed shadow-xl"
          style={{
            top: pos.top,
            left: pos.left,
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
            color: "var(--foreground)",
          }}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-2 top-2 rounded-full p-0.5 transition-colors hover:bg-muted"
            aria-label="Đóng"
          >
            <X size={12} style={{ color: "var(--muted-foreground)" }} />
          </button>
          {content}
        </div>
      )}
    </>
  );
}
