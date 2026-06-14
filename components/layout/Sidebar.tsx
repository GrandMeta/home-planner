"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 min-h-screen border-r bg-white border-[var(--border)] shrink-0">
      {/* Logo / App name */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary)]">
          <Home className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-[var(--text-primary)]">
            Home Decision
          </p>
          <p className="text-[11px] text-[var(--text-muted)] leading-tight">
            Cockpit
          </p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col flex-1 gap-0.5 px-3 py-3 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
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
      </nav>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-[var(--border)]">
        <p className="text-[11px] text-[var(--text-disabled)]">
          Local-first · No cloud
        </p>
      </div>
    </aside>
  );
}
