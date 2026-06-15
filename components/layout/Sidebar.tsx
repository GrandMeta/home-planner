"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, NAV_SECTIONS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

const SECTION_LABELS: Record<string, string> = {
  Explore: "Explore",
  Track: "Keep track",
  Help: "Help",
};

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 min-h-screen border-r bg-white border-[var(--border)] shrink-0">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2.5 px-5 py-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary)] to-cyan-500 shadow-sm">
          <span className="text-white font-bold text-sm">N</span>
        </div>
        <div>
          <p className="text-sm font-bold leading-tight text-[var(--text-primary)]">Nest</p>
          <p className="text-[11px] text-[var(--text-muted)] leading-tight">
            your home-buying buddy
          </p>
        </div>
      </Link>

      {/* Add CTA */}
      <div className="px-3 pt-3">
        <Link
          href="/projects?add=1"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add a property
        </Link>
      </div>

      {/* Nav, grouped by section */}
      <nav className="flex flex-col flex-1 px-3 py-3 overflow-y-auto gap-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section}>
            <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-disabled)]">
              {SECTION_LABELS[section]}
            </p>
            <div className="flex flex-col gap-0.5">
              {NAV_ITEMS.filter((i) => i.section === section).map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.description}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-[var(--primary-light)] text-[var(--primary)] font-medium"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-4 h-4 shrink-0",
                        isActive ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[var(--border)]">
        <p className="text-[11px] text-[var(--text-disabled)]">
          Saved on this device · private to you
        </p>
      </div>
    </aside>
  );
}
