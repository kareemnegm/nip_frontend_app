import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";

export type CtaBandProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  tone?: "dark" | "light";
  actions?: React.ReactNode;
  className?: string;
};

export function CtaBand({
  eyebrow,
  title,
  description,
  tone = "dark",
  actions,
  className,
}: CtaBandProps) {
  const isDark = tone === "dark";

  return (
    <section
      className={cn(
        "w-full",
        isDark ? "bg-brand text-white" : "bg-sapphire-50 text-ink",
        className,
      )}
    >
      <Container className="flex flex-col items-center py-16 text-center sm:py-20">
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
        {typeof title === "string" ? (
          <h2
            className={cn(
              "mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl",
              isDark ? "text-white" : "text-brand",
            )}
          >
            {title}
          </h2>
        ) : (
          title
        )}
        {description ? (
          <p
            className={cn(
              "mt-4 max-w-2xl text-sm leading-7 sm:text-base",
              isDark ? "text-white/75" : "text-ink-secondary",
            )}
          >
            {description}
          </p>
        ) : null}
        {actions ? (
          <div className="mt-8 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            {actions}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
