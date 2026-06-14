import { Settings, Download, Upload, Trash2, Database } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

function SettingRow({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-[var(--border)] last:border-0">
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">{title}</p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{description}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function ActionButton({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "danger";
}) {
  const styles =
    variant === "danger"
      ? "border-[var(--danger)] text-[var(--danger)] hover:bg-[var(--danger-light)]"
      : "border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]";
  return (
    <button
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${styles}`}
    >
      {children}
    </button>
  );
}

export default function SettingsPage() {
  return (
    <div>
      <PageHeader
        icon={Settings}
        title="Settings"
        description="App configuration, data import/export, and preferences. The portal is local-first — your data lives in your browser."
      />

      <div className="p-6 space-y-4">
        {/* Data management */}
        <div className="bg-white rounded-xl border border-[var(--border)] px-5">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-medium pt-4 pb-2">Data Management</p>
          <SettingRow
            title="Export All Data"
            description="Download your complete project database as a JSON file for backup or migration."
            action={
              <ActionButton>
                <Download className="w-3.5 h-3.5" />
                Export JSON
              </ActionButton>
            }
          />
          <SettingRow
            title="Import Data"
            description="Restore a previously exported JSON Project Pack or import from a structured JSON file."
            action={
              <ActionButton>
                <Upload className="w-3.5 h-3.5" />
                Import JSON
              </ActionButton>
            }
          />
          <SettingRow
            title="Storage"
            description="Data is stored locally in your browser using IndexedDB. No cloud sync in version 1."
            action={
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-xs text-[var(--text-muted)]">
                <Database className="w-3.5 h-3.5" />
                Local only
              </div>
            }
          />
          <SettingRow
            title="Clear All Data"
            description="Permanently delete all projects, units, site visits, and follow-ups. This cannot be undone."
            action={
              <ActionButton variant="danger">
                <Trash2 className="w-3.5 h-3.5" />
                Clear Data
              </ActionButton>
            }
          />
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-xl border border-[var(--border)] px-5">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-medium pt-4 pb-2">Preferences</p>
          <SettingRow
            title="Default City / Region"
            description="Used as the default location context for new projects and map view."
            action={
              <div className="px-3 py-1.5 border border-[var(--border)] rounded-lg text-xs text-[var(--text-secondary)] bg-white">
                East Bangalore (default)
              </div>
            }
          />
          <SettingRow
            title="Currency Format"
            description="All monetary values are displayed in Indian format (₹ Cr / ₹ L)."
            action={
              <div className="px-3 py-1.5 border border-[var(--border)] rounded-lg text-xs text-[var(--text-secondary)] bg-white">
                ₹ Indian format
              </div>
            }
          />
        </div>

        {/* About */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-5">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide font-medium mb-3">About</p>
          <p className="text-sm text-[var(--text-secondary)]">
            <strong className="text-[var(--text-primary)]">Home Decision Cockpit</strong> — Real Estate Decision Portal
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Version 1 · Local-first · No backend · No paid APIs</p>
        </div>
      </div>
    </div>
  );
}
