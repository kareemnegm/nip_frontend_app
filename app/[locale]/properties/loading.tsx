import { SiteShell } from "@/components/SiteShell";

export default function PropertiesLoading() {
  return (
    <SiteShell>
      <div className="animate-pulse bg-surface-muted pt-16 pb-9">
        <div className="mx-auto h-40 max-w-[846px] rounded-[var(--radius-card)] bg-white/60" />
      </div>
      <div className="mx-auto grid max-w-[846px] gap-x-8 gap-y-10 py-10 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-[480px] rounded-[var(--radius-card)] bg-sapphire-50" />
        ))}
      </div>
    </SiteShell>
  );
}
