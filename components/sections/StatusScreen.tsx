import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";

export type StatusScreenProps = {
  icon: IconName;
  iconTone?: "brand" | "success" | "error";
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
};

const iconToneClasses: Record<NonNullable<StatusScreenProps["iconTone"]>, string> = {
  brand: "bg-brand text-white",
  success: "bg-success text-white",
  error: "bg-error text-white",
};

const eyebrowToneClasses: Record<NonNullable<StatusScreenProps["iconTone"]>, string> = {
  brand: "text-brand",
  success: "text-success",
  error: "text-error",
};

export function StatusScreen({
  icon,
  iconTone = "brand",
  eyebrow,
  title,
  description,
  actions,
}: StatusScreenProps) {
  return (
    <section className="w-full bg-surface">
      <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
        <span
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            iconToneClasses[iconTone],
          )}
        >
          <Icon name={icon} className="h-7 w-7" />
        </span>
        {eyebrow ? (
          <p
            className={cn(
              "mt-6 text-[11px] font-semibold uppercase tracking-[0.18em]",
              eyebrowToneClasses[iconTone],
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-brand sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-xl text-sm leading-7 text-ink-secondary sm:text-base">
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
