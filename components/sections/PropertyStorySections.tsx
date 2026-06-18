import Image from "next/image";
import { SpeakWithNipButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { ApiFacility } from "@/types/api";
import type { PropertyGalleryImage } from "@/types/api/property";
import {
  PropertyGalleryClient,
} from "./PropertyGalleryClient";

export type PropertyStoryLabels = {
  storyTitle: string;
  amenitiesTitle: string;
  locationTitle: string;
};

export function PropertyGallery({
  images = [],
  title = "Property",
}: {
  images?: PropertyGalleryImage[];
  title?: string;
}) {
  return <PropertyGalleryClient images={images} title={title} />;
}

export function PropertyStoryContent({
  description,
  facilities,
  locationNote,
  locationImageUrl,
  labels,
}: {
  description?: string;
  facilities?: ApiFacility[];
  locationNote?: string;
  locationImageUrl?: string;
  labels: PropertyStoryLabels;
}) {
  const amenityItems =
    facilities?.map((item) => ({
      label: item.facility,
      icon: "home" as const,
    })) ?? [];

  const showLocationSection = Boolean(locationNote || locationImageUrl);

  return (
    <div className="flex w-full max-w-[672px] flex-col gap-7">
      {description ? (
        <div className="space-y-7">
          <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
            {labels.storyTitle}
          </h2>
          <p className="text-body-sm text-ink">{description}</p>
        </div>
      ) : null}

      {amenityItems.length > 0 ? (
        <div className="space-y-7">
          <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
            {labels.amenitiesTitle}
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

      {showLocationSection ? (
        <div className="space-y-7">
          <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
            {labels.locationTitle}
          </h2>
          {locationNote ? (
            <p className="text-body-sm text-ink-secondary">{locationNote}</p>
          ) : null}
          {locationImageUrl ? (
            <div className="relative h-[300px] overflow-hidden rounded-[var(--radius-card)]">
              <Image
                src={locationImageUrl}
                alt={labels.locationTitle}
                fill
                className="object-cover"
                sizes="(max-width: 672px) 100vw, 672px"
              />
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center rounded-[var(--radius-card)] bg-basalt-100">
              <Icon name="mapPin" className="h-[100px] w-[100px] text-white/80" />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

export type PropertyViewingLabels = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PropertyViewingCard({
  children,
  labels,
}: {
  children?: React.ReactNode;
  labels: PropertyViewingLabels;
}) {
  return (
    <aside className="w-full max-w-[360px] shrink-0 rounded-[var(--radius-card)] border border-line bg-sapphire-50 p-6 shadow-[var(--shadow-card)] lg:sticky lg:top-28 lg:self-start">
      <p className="text-overline font-semibold text-accent">{labels.eyebrow}</p>
      <h2 className="mt-3 text-xl font-bold leading-[26px] text-brand">{labels.title}</h2>
      <p className="mt-2 text-start text-body-sm leading-[18px] text-ink-secondary">
        {labels.description}
      </p>
      <div className="mt-6">{children}</div>
      <div className="mt-6 border-t border-line pt-6">
        <SpeakWithNipButton className="w-full justify-center" />
      </div>
    </aside>
  );
}
