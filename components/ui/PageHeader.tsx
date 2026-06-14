import { type LucideIcon } from "lucide-react";

type PageHeaderProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
};

export function PageHeader({ icon: Icon, title, description, badge }: PageHeaderProps) {
  return (
    <div className="px-6 py-6 border-b border-[var(--border)] bg-white">
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--primary-light)] shrink-0">
          <Icon className="w-5 h-5 text-[var(--primary)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h1>
            {badge && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[var(--surface-muted)] text-[var(--text-muted)]">
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">{description}</p>
        </div>
      </div>
    </div>
  );
}
