import { SiteShell } from "@/components/SiteShell";

export default function CatalogLoading() {
  return (
    <SiteShell>
      <div className="animate-pulse space-y-6 px-6 py-16">
        <div className="mx-auto h-10 max-w-md rounded bg-sapphire-100" />
        <div className="mx-auto grid max-w-[846px] gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-[440px] rounded-[var(--radius-card)] bg-sapphire-50" />
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
