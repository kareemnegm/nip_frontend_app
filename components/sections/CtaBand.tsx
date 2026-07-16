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
      <Container className="flex flex-col items-center gap-10 py-16 text-center sm:py-20">
        <div className="flex flex-col items-center gap-4">
          {eyebrow ? (
            <p
              className={cn(
                "text-overline font-semibold uppercase",
                isDark ? "text-accent-on-dark" : "text-accent",
              )}
            >
              {eyebrow}
            </p>
          ) : null}
          {typeof title === "string" ? (
            <h2
              className={cn(
                "font-display font-normal uppercase text-display-lg",
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
                "max-w-2xl text-body-regular",
                isDark ? "text-white/75" : "text-ink-secondary",
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
            {actions}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
