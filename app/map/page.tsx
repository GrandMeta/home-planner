import { Map } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

export default function MapPage() {
  return (
    <div>
      <PageHeader
        icon={Map}
        title="Map View"
        description="Visualise all tracked project locations on a map. Analyse commute distances, proximity to key locations (office, school, metro, hospital), and neighbourhood context."
        badge="Leaflet + OpenStreetMap"
      />

      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {["My Office", "School", "Metro Station"].map((label) => (
            <div key={label} className="bg-white border border-[var(--border)] rounded-lg px-3 py-2 flex items-center justify-between">
              <span className="text-sm text-[var(--text-secondary)]">{label}</span>
              <span className="text-xs text-[var(--text-disabled)]">Not set</span>
            </div>
          ))}
        </div>

        {/* Map placeholder */}
        <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="h-[480px] bg-[var(--surface-muted)] flex flex-col items-center justify-center gap-2">
            <Map className="w-10 h-10 text-[var(--text-disabled)]" />
            <p className="text-sm text-[var(--text-muted)] font-medium">Map will render here</p>
            <p className="text-xs text-[var(--text-disabled)]">
              Leaflet + OpenStreetMap — no paid API key required
            </p>
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)]">
          Each project will appear as a map pin. Clicking a pin will show a summary card with project name, distance from key locations, and shortlist status.
        </p>
      </div>
    </div>
  );
}
