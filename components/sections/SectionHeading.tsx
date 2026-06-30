import { EditableText } from "@/components/EditableText";
import { cn } from "@/lib/cn";
import { getRequestLocale } from "@/lib/i18n/server";

export type SectionHeadingEditable = {
  relUrl: string;
  titleKey: string;
  descKey?: string;
};

export type SectionHeadingProps = {
  title: string;
  description?: string;
  /** max-w applied to the description; defaults to max-w-[464px] */
  descriptionMaxWidth?: string;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  editable?: SectionHeadingEditable;
};

/**
 * Figma "01 Display/Large" spec:
 *   font-family: Didot; font-size: 44px; font-weight: 400;
 *   line-height: 42px; letter-spacing: -0.88px (= -0.02em); text-transform: uppercase;
 *   color: #0B3268 (text-brand); text-align: center
 *
 * Mobile derived: text-display-sm (36/38/-0.02em).
 * Tokens include line-height + letter-spacing — no need for separate leading/tracking.
 */
const titleBase =
  "font-display font-normal uppercase text-brand text-display-lg";

/**
 * Figma description: Archivo Regular 15/22 #323E58; text-align: center (inherited from container).
 * CTA section override: text-body-sm via descriptionClassName prop.
 */
const descBase = "text-body-regular font-normal text-ink-secondary";

export async function SectionHeading({
  title,
  description,
  descriptionMaxWidth = "max-w-[464px]",
  align = "center",
  className,
  titleClassName,
  descriptionClassName,
  editable,
}: SectionHeadingProps) {
  const locale = await getRequestLocale();
  const titleClass = cn(titleBase, titleClassName);
  const descClass = cn(
    descBase,
    align === "center" && "mx-auto",
    descriptionMaxWidth,
    descriptionClassName,
  );

  return (
    <div
      data-reveal
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
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
          className={titleClass}
        />
      ) : (
        <h2 className={titleClass}>{title}</h2>
      )}
      {description ? (
        editable?.descKey ? (
          <EditableText
            relUrl={editable.relUrl}
            blockKey={editable.descKey}
            locale={locale}
            placeholderContent={description}
            placeholderTag="p"
            className={descClass}
          />
        ) : (
          <p className={descClass}>{description}</p>
        )
      ) : null}
    </div>
  );
}
