import { EditableText } from "@/components/EditableText";
import { getRequestLocale } from "@/lib/i18n/server";
import { cn } from "@/lib/cn";

export type SectionHeadingEditable = {
  relUrl: string;
  titleKey: string;
  descKey?: string;
};

export type SectionHeadingProps = {
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  editable?: SectionHeadingEditable;
};

const titleClasses =
  "font-[family-name:var(--font-display)] text-[36px] font-normal uppercase leading-[38px] tracking-[-0.02em] text-brand sm:text-[44px] sm:leading-[42px]";

const descriptionClasses =
  "mx-auto mt-4 max-w-[464px] text-body-md leading-[22px] text-ink-secondary";

export async function SectionHeading({
  title,
  description,
  align = "center",
  className,
  titleClassName,
  editable,
}: SectionHeadingProps) {
  const locale = await getRequestLocale();

  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {editable ? (
        <EditableText
          relUrl={editable.relUrl}
          blockKey={editable.titleKey}
          locale={locale}
          placeholderContent={title}
          placeholderTag="h2"
          className={cn(titleClasses, titleClassName)}
        />
      ) : (
        <h2 className={cn(titleClasses, titleClassName)}>{title}</h2>
      )}
      {description ? (
        editable?.descKey ? (
          <EditableText
            relUrl={editable.relUrl}
            blockKey={editable.descKey}
            locale={locale}
            placeholderContent={description}
            placeholderTag="p"
            className={descriptionClasses}
          />
        ) : (
          <p className={descriptionClasses}>{description}</p>
        )
      ) : null}
    </div>
  );
}
