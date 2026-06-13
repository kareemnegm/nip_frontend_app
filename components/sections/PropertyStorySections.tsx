import { Button, SpeakWithNipButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

function GalleryPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-[var(--radius-card)] bg-basalt-100 ${className ?? ""}`}
    >
      <Icon name="home" className="h-[70px] w-[70px] text-white" />
    </div>
  );
}

export function PropertyGallery() {
  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <GalleryPlaceholder className="h-[280px] w-full lg:h-[460px] lg:max-w-[708px] lg:flex-[708]" />
      <div className="flex w-full flex-col gap-3 lg:w-[360px] lg:shrink-0">
        <GalleryPlaceholder className="h-[224px] w-full" />
        <GalleryPlaceholder className="h-[224px] w-full" />
      </div>
    </div>
  );
}

const amenities: Array<{ label: string; icon: "home" | "grid" | "user" | "building" | "plus" | "mapPin" | "clock" | "lock" }> = [
  { label: "Infinity Pool", icon: "home" },
  { label: "Basketball Court", icon: "grid" },
  { label: "Concierge", icon: "user" },
  { label: "Flowers Garden", icon: "mapPin" },
  { label: "Fitness Centre", icon: "building" },
  { label: "BBQ Area", icon: "plus" },
  { label: "Kids Area", icon: "user" },
  { label: "Cycling Trail", icon: "grid" },
  { label: "Valet Parking", icon: "lock" },
];

const storyCopy =
  "A landmark residence on Sheikh Zayed Road, pairing branded service with skyline views and a position at the centre of the city's commercial spine. Interiors are delivered to a turnkey standard, with floor-to-ceiling glazing and a layout tuned for both living and long-let yield.";

export function PropertyStoryContent() {
  return (
    <div className="flex w-full max-w-[672px] flex-col gap-7">
      <div className="space-y-7">
        <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
          The Story
        </h2>
        <p className="text-body-sm text-ink">{storyCopy}</p>
      </div>

      <div className="space-y-7">
        <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
          Amenities
        </h2>
        <div className="flex flex-wrap gap-2.5">
          {amenities.map(({ label, icon }) => (
            <span
              key={label}
              className="inline-flex items-center gap-2 rounded-[var(--radius-field)] bg-basalt-50 py-2 pl-3 pr-4 text-[11px] font-medium leading-[14px] text-ink-secondary"
            >
              <Icon name={icon} className="h-6 w-6 shrink-0 text-brand" />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-7">
        <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
          Location
        </h2>
        <div className="flex h-[300px] items-center justify-center rounded-[var(--radius-card)] bg-basalt-100">
          <Icon name="mapPin" className="h-[100px] w-[100px] text-white/80" />
        </div>
      </div>
    </div>
  );
}

export function PropertyViewingCard() {
  return (
    <aside className="w-full max-w-[312px] shrink-0 rounded-[var(--radius-card)] border border-[#dbe0ec] bg-sapphire-50 p-6 lg:sticky lg:top-28 lg:self-start">
      <p className="text-[11px] font-medium leading-[14px] text-accent">
        ARRANGE A VIEWING
      </p>
      <p className="mt-6 text-body-sm text-ink-tertiary">
        Speak with the advisor handling this residence.
      </p>
      <div className="mt-6 flex items-center gap-2.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand">
          <span className="font-[family-name:var(--font-logo)] text-[10px] font-medium leading-none text-white">
            NIP
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold leading-4 text-brand">
            NIP Private Advisory
          </p>
          <p className="text-xs leading-4 text-basalt-300">
            Responds within 1 business day
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <Button href="/contact" variant="accent" className="w-full">
          Request Details
        </Button>
        <SpeakWithNipButton href="/contact" className="w-full justify-center" />
      </div>
    </aside>
  );
}
