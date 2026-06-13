import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";

export type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  tone?: "light" | "dark";
  align?: "left" | "center";
  top?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  tone = "light",
  align = "left",
  top,
  actions,
  className,
}: PageHeroProps) {
  const isDark = tone === "dark";

  return (
    <section
      data-site-hero
      className={cn(
        "w-full",
        isDark
          ? "bg-gradient-to-b from-sapphire-800 to-brand text-white"
          : "bg-sapphire-50 text-ink",
        className,
      )}
    >
      <Container
        className={cn(
          "py-12 sm:py-16 lg:py-20",
          align === "center" && "flex flex-col items-center text-center",
        )}
      >
        {top ? <div className="mb-5">{top}</div> : null}
        {eyebrow ? (
          <p
            className={cn(
              "text-[11px] font-semibold uppercase tracking-[0.18em]",
              isDark ? "text-gold" : "text-brand",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1
          className={cn(
            "mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl",
            isDark ? "text-white" : "text-brand",
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "mt-4 max-w-2xl text-sm leading-7 sm:text-base",
              align === "center" && "mx-auto",
              isDark ? "text-white/75" : "text-ink-secondary",
            )}
          >
            {description}
          </p>
        ) : null}
        {actions ? (
          <div
            className={cn(
              "mt-8 flex flex-col gap-4 sm:flex-row",
              align === "center" && "justify-center",
            )}
          >
            {actions}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
