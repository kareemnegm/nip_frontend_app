import { EditableText } from "@/components/EditableText";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/config";
import { CtaBand } from "./CtaBand";
import type { CtaBandProps } from "./CtaBand";

export type EditableCtaBandProps = {
  relUrl: string;
  blockKey: string;
  locale: Locale;
  placeholderContent: string;
  eyebrow?: string;
  actions?: React.ReactNode;
  tone?: CtaBandProps["tone"];
  className?: string;
};

export function EditableCtaBand({
  relUrl,
  blockKey,
  locale,
  placeholderContent,
  eyebrow,
  actions,
  tone = "dark",
  className,
}: EditableCtaBandProps) {
  const isDark = tone === "dark";

  return (
    <CtaBand
      tone={tone}
      className={className}
      eyebrow={eyebrow}
      actions={actions}
      title={
        <EditableText
          relUrl={relUrl}
          blockKey={blockKey}
          locale={locale}
          placeholderContent={placeholderContent}
          placeholderTag="h2"
          className={cn(
            "font-display font-normal uppercase text-display-sm sm:text-display-lg",
            isDark ? "text-white" : "text-brand",
          )}
        />
      }
    />
  );
}
