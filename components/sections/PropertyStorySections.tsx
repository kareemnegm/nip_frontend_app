import Image from "next/image";
import { SpeakWithNipButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { ApiFacility } from "@/types/api";

function GalleryPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-[var(--radius-card)] bg-basalt-100 ${className ?? ""}`}
    >
      <Icon name="home" className="h-[70px] w-[70px] text-white" />
    </div>
  );
}

export function PropertyGallery({
  images = [],
  title = "Property",
}: {
  images?: string[];
  title?: string;
}) {
  const [primary, ...rest] = images;

  if (!primary) {
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

  return (
    <div className="flex flex-col gap-3 lg:flex-row">
      <div className="relative h-[280px] w-full overflow-hidden rounded-[var(--radius-card)] lg:h-[460px] lg:max-w-[708px] lg:flex-[708]">
        <Image src={primary} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 708px" priority />
      </div>
      <div className="flex w-full flex-col gap-3 lg:w-[360px] lg:shrink-0">
        {(rest.length > 0 ? rest.slice(0, 2) : [primary, primary]).map((src, index) => (
          <div key={`${src}-${index}`} className="relative h-[224px] w-full overflow-hidden rounded-[var(--radius-card)]">
            <Image src={src} alt={`${title} ${index + 2}`} fill className="object-cover" sizes="360px" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PropertyStoryContent({
  description,
  facilities,
  locationNote,
}: {
  description?: string;
  facilities?: ApiFacility[];
  locationNote?: string;
}) {
  const amenityItems =
    facilities?.map((item) => ({
      label: item.facility,
      icon: "home" as const,
    })) ?? [];

  return (
    <div className="flex w-full max-w-[672px] flex-col gap-7">
      {description ? (
        <div className="space-y-7">
          <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
            The Story
          </h2>
          <p className="text-body-sm text-ink">{description}</p>
        </div>
      ) : null}

      {amenityItems.length > 0 ? (
        <div className="space-y-7">
          <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
            Amenities
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {amenityItems.map(({ label, icon }) => (
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
      ) : null}

      <div className="space-y-7">
        <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
          Location
        </h2>
        {locationNote ? (
          <p className="text-body-sm text-ink-secondary">{locationNote}</p>
        ) : null}
        <div className="flex h-[300px] items-center justify-center rounded-[var(--radius-card)] bg-basalt-100">
          <Icon name="mapPin" className="h-[100px] w-[100px] text-white/80" />
        </div>
      </div>
    </div>
  );
}

export function PropertyViewingCard({ children }: { children?: React.ReactNode }) {
  return (
    <aside className="w-full max-w-[360px] shrink-0 rounded-[var(--radius-card)] border border-line bg-sapphire-50 p-6 shadow-[var(--shadow-card)] lg:sticky lg:top-28 lg:self-start">
      <p className="text-overline font-semibold text-accent">Private Viewing</p>
      <h2 className="mt-3 text-xl font-bold leading-[26px] text-brand">
        Arrange a Confidential Visit
      </h2>
      <p className="mt-2 text-body-sm leading-[18px] text-ink-secondary">
        Share your details and a NIP advisor will confirm the next step.
      </p>
      <div className="mt-6">{children}</div>
      <div className="mt-6 border-t border-line pt-6">
        <SpeakWithNipButton className="w-full justify-center" />
      </div>
    </aside>
  );
}
