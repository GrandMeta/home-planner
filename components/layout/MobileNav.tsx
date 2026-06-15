"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile topbar */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-white border-[var(--border)] md:hidden sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-[var(--primary)] to-cyan-500">
            <span className="text-white font-bold text-xs">N</span>
          </div>
          <span className="text-sm font-bold text-[var(--text-primary)]">
            Nest
          </span>
        </Link>
        <button
          onClick={() => setOpen(!open)}
          className="p-1 rounded-md text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
          aria-label="Toggle navigation"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        >
          <nav
            className="absolute top-0 left-0 h-full w-64 bg-white shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--border)]">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primary)] to-cyan-500">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <p className="text-sm font-bold text-[var(--text-primary)]">Nest</p>
            </div>
            <div className="flex flex-col gap-0.5 px-3 py-3 overflow-y-auto flex-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                      isActive
                        ? "bg-[var(--primary-light)] text-[var(--primary)] font-medium"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
