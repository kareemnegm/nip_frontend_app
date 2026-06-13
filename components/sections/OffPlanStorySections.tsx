import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";

const paymentStages = [
  {
    subtitle: "Reservation & SPA",
    percent: "10%",
    label: "On Booking",
    className: "bg-sapphire-400",
    subtitleClassName: "text-sapphire-100",
  },
  {
    subtitle: "Linked to Milestones",
    percent: "20%",
    label: "During Construction",
    className: "bg-sapphire-500",
    subtitleClassName: "text-sapphire-200",
  },
  {
    subtitle: "Across Build Phases",
    percent: "30%",
    label: "Construction",
    className: "bg-sapphire-600",
    subtitleClassName: "text-sapphire-200",
  },
  {
    subtitle: "Keys & Completion",
    percent: "40%",
    label: "On Handover",
    className: "bg-brand",
    subtitleClassName: "text-sapphire-200",
  },
];

const units = [
  { type: "1 Bedroom", size: "720 – 840", price: "AED 1,200,000" },
  { type: "2 Bedroom", size: "1,150 – 1,320", price: "AED 2,100,000" },
  { type: "3 Bedroom", size: "1,900 – 2,150", price: "AED 3,450,000" },
  { type: "4 Bed Penthouse", size: "3,200+", price: "AED 4,710,000" },
];

const masterplanAmenities: Array<{ label: string; icon: IconName }> = [
  { label: "Private Beach", icon: "mapPin" },
  { label: "Infinity Pools", icon: "home" },
  { label: "Signature Spa", icon: "building" },
  { label: "Residents' Lounge", icon: "sofa" },
  { label: "Concierge", icon: "user" },
  { label: "Marina Access", icon: "mapPin" },
];

export function OffPlanHeroImage() {
  return (
    <div className="flex h-[280px] w-full items-center justify-center rounded-[var(--radius-card)] bg-basalt-100 sm:h-[460px]">
      <Icon name="building" className="h-[70px] w-[70px] text-white" />
    </div>
  );
}

export function PaymentPlanSection() {
  return (
    <div className="space-y-6">
      <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
        Payment Plan
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {paymentStages.map((stage) => (
          <div
            key={stage.label}
            className={cn(
              "flex flex-col gap-4 rounded-[var(--radius-card)] px-7 py-6 text-white",
              stage.className,
            )}
          >
            <p className={cn("text-xs leading-4", stage.subtitleClassName)}>
              {stage.subtitle}
            </p>
            <p className="text-[36px] font-bold leading-[42px]">{stage.percent}</p>
            <p className="text-xs font-semibold leading-4">{stage.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AvailableUnitsSection() {
  return (
    <div className="space-y-6">
      <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
        Available Units
      </h2>
      <div className="overflow-hidden rounded-[var(--radius-card)] border border-[#dbe0ec]">
        <div className="grid grid-cols-[1fr_0.7fr_0.7fr] bg-brand px-6 py-4 text-overline font-semibold text-white sm:grid-cols-[430px_300px_1fr]">
          <span>Unit Type</span>
          <span>Size (sqft)</span>
          <span>Starting Price</span>
        </div>
        {units.map((unit, index) => (
          <div
            key={unit.type}
            className={cn(
              "grid grid-cols-[1fr_0.7fr_0.7fr] bg-white px-6 py-4 text-body-sm sm:grid-cols-[430px_300px_1fr]",
              index < units.length - 1 && "border-b border-[#edf0f4]",
            )}
          >
            <span className="font-medium text-ink-secondary">{unit.type}</span>
            <span className="text-ink-secondary">{unit.size}</span>
            <span className="font-medium text-brand">{unit.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MasterplanSection() {
  return (
    <div className="space-y-6">
      <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
        Masterplan &amp; Location
      </h2>
      <div className="flex h-[280px] items-center justify-center rounded-[var(--radius-card)] bg-basalt-100 sm:h-[340px]">
        <Icon name="mapPin" className="h-[100px] w-[100px] text-white/80" />
      </div>
      <div className="flex flex-wrap gap-2.5">
        {masterplanAmenities.map(({ label, icon }) => (
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
  );
}

export function ProjectRegisterCta() {
  return (
    <section className="bg-brand py-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col items-center gap-10 text-center",
          )}
        >
          <div className="max-w-[608px] space-y-4">
            <p className="text-overline font-semibold text-accent-on-dark">
              REGISTER YOUR INTEREST
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[44px] uppercase leading-[42px] tracking-[-0.02em] text-white">
              Early Access to Units and Payment Plans
            </h2>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-[var(--radius-field)] bg-white px-6 py-[9px] text-xs font-semibold leading-4 text-brand transition-colors hover:bg-sapphire-50"
          >
            Speak with NIP
          </Link>
        </div>
      </div>
    </section>
  );
}
