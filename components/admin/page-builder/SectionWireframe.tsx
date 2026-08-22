import { cn } from "@/lib/cn";

/**
 * Tiny CSS diagram of each section's layout so staff recognise a block
 * before adding it — no screenshots to maintain.
 */
const BAR = "rounded-[1px] bg-sapphire-200";
const CARD = "flex-1 rounded-[2px] bg-sapphire-100";
const PILL = "h-[3px] w-4 rounded-full bg-sapphire-300";

function TitleLines({ align = "center" }: { align?: "center" | "start" }) {
  return (
    <div
      className={cn(
        "flex w-full flex-col gap-1",
        align === "center" ? "items-center" : "items-start",
      )}
    >
      <span className={cn(BAR, "h-[4px] w-3/5")} />
      <span className={cn(BAR, "h-[3px] w-2/5 opacity-70")} />
    </div>
  );
}

function Wireframe({ type }: { type: string }) {
  switch (type) {
    case "hero":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-1.5 rounded-[3px] bg-sapphire-700 px-3">
          <span className="h-[4px] w-3/5 rounded-[1px] bg-white/80" />
          <span className="h-[3px] w-2/5 rounded-[1px] bg-white/50" />
          <div className="mt-1 flex gap-1">
            <span className="h-[4px] w-5 rounded-full bg-white/80" />
            <span className="h-[4px] w-5 rounded-full bg-white/40" />
          </div>
        </div>
      );
    case "search-strip":
      return (
        <div className="flex h-full items-center justify-center px-3">
          <div className="flex w-full items-center gap-1 rounded-[3px] border border-line bg-white p-1">
            <span className={cn(BAR, "h-[4px] flex-1")} />
            <span className="h-3 w-5 rounded-[2px] bg-sapphire-600" />
          </div>
        </div>
      );
    case "insight-cards":
      return (
        <div className="flex h-full flex-col justify-center gap-1.5 px-3">
          <TitleLines align="start" />
          <div className="flex gap-1">
            <span className={cn(CARD, "h-5")} />
            <span className={cn(CARD, "h-5")} />
            <span className={cn(CARD, "h-5")} />
          </div>
        </div>
      );
    case "property-grid":
      return (
        <div className="flex h-full flex-col justify-center gap-1.5 px-3">
          <TitleLines />
          <div className="flex gap-1">
            <span className={cn(CARD, "h-4")} />
            <span className={cn(CARD, "h-4")} />
            <span className={cn(CARD, "h-4")} />
          </div>
        </div>
      );
    case "property-carousel":
      return (
        <div className="flex h-full flex-col justify-center gap-1.5 overflow-hidden px-3">
          <TitleLines />
          <div className="flex gap-1">
            <span className={cn(CARD, "h-4")} />
            <span className={cn(CARD, "h-4")} />
            <span className="h-4 w-3 rounded-[2px] bg-sapphire-100 opacity-60" />
          </div>
        </div>
      );
    case "communities":
      return (
        <div className="flex h-full flex-col justify-center gap-1 px-3">
          <TitleLines />
          <div className="grid grid-cols-4 gap-1">
            <span className="h-3 rounded-[2px] bg-sapphire-100" />
            <span className="h-3 rounded-[2px] bg-sapphire-100" />
            <span className="h-3 rounded-[2px] bg-sapphire-100" />
            <span className="h-3 rounded-[2px] bg-sapphire-100" />
          </div>
        </div>
      );
    case "market-pulse":
      return (
        <div className="flex h-full flex-col justify-center gap-1.5 px-3">
          <TitleLines />
          <div className="grid grid-cols-4 gap-1">
            {[0, 1, 2, 3].map((key) => (
              <span
                key={key}
                className="flex h-4 items-center justify-center rounded-[2px] border border-line bg-white"
              >
                <span className={cn(BAR, "h-[3px] w-2/3")} />
              </span>
            ))}
          </div>
        </div>
      );
    case "private-office":
      return (
        <div className="flex h-full items-center gap-2 rounded-[3px] bg-sapphire-800 px-3">
          <div className="flex flex-1 flex-col gap-1">
            <span className="h-[4px] w-4/5 rounded-[1px] bg-white/80" />
            <span className="h-[3px] w-3/5 rounded-[1px] bg-white/40" />
          </div>
          <span className="h-[5px] w-6 rounded-full bg-white/80" />
        </div>
      );
    case "cta":
      return (
        <div className="flex h-full flex-col items-center justify-center gap-1.5 bg-surface-muted px-3">
          <TitleLines />
          <div className="flex gap-1">
            <span className="h-[5px] w-6 rounded-full bg-sapphire-600" />
            <span className="h-[5px] w-6 rounded-full bg-sapphire-300" />
          </div>
        </div>
      );
    case "cta-band":
      return (
        <div className="flex h-full items-center justify-center rounded-[3px] bg-sapphire-800 px-3">
          <div className="flex w-full flex-col items-center gap-1">
            <span className="h-[4px] w-3/5 rounded-[1px] bg-white/80" />
            <span className="h-[3px] w-2/5 rounded-[1px] bg-white/40" />
          </div>
        </div>
      );
    default:
      return (
        <div className="flex h-full items-center justify-center gap-1">
          <span className={PILL} />
          <span className={PILL} />
        </div>
      );
  }
}

export function SectionWireframe({
  type,
  className,
}: {
  type: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "overflow-hidden rounded-[var(--radius-field)] border border-line bg-white",
        className,
      )}
    >
      <Wireframe type={type} />
    </div>
  );
}
