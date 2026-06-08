import { cn } from "@/lib/cn";

export type SectionHeadingProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
};

export function SectionHeading({
  title,
  description,
  align = "center",
  className,
  titleClassName,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <h2
        className={cn(
          "font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-sm leading-7 text-ink-secondary sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
