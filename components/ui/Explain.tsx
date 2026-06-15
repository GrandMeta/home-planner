"use client";

import { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";
import { lookupTerm } from "@/lib/glossary";
import { cn } from "@/lib/utils";

interface ExplainProps {
  /** Glossary key, e.g. "carpet area". */
  term: string;
  /** What to display. Defaults to the glossary label. */
  children?: React.ReactNode;
  /** Show the little (?) icon. Default true. */
  icon?: boolean;
  className?: string;
}

/**
 * A friendly, tap-anywhere term explainer. New buyers can tap any underlined
 * word to get a one-line, jargon-free explanation — no need to leave the page
 * or know what anything means in advance.
 */
export function Explain({ term, children, icon = true, className }: ExplainProps) {
  const entry = lookupTerm(term);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  const label = children ?? entry?.label ?? term;

  // Unknown term — just render the text plainly.
  if (!entry) return <span className={className}>{label}</span>;

  return (
    <span ref={ref} className={cn("relative inline-flex items-center", className)}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-expanded={open}
        className="inline-flex items-center gap-0.5 text-left underline decoration-dotted decoration-slate-400 underline-offset-2 hover:decoration-[var(--primary)] focus:outline-none"
      >
        <span>{label}</span>
        {icon && <HelpCircle className="w-3 h-3 text-slate-400 shrink-0" />}
      </button>

      {open && (
        <span
          role="tooltip"
          className="absolute z-50 left-0 top-full mt-1.5 w-64 rounded-xl bg-slate-900 text-white p-3 shadow-xl text-left animate-in"
        >
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-slate-300 mb-1">
            {entry.label}
          </span>
          <span className="block text-xs leading-relaxed text-slate-100">
            {entry.short}
          </span>
        </span>
      )}
    </span>
  );
}
