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
  actions?: React.ReactNode;
  tone?: CtaBandProps["tone"];
  className?: string;
};

export function EditableCtaBand({
  relUrl,
  blockKey,
  locale,
  placeholderContent,
  actions,
  tone = "dark",
  className,
}: EditableCtaBandProps) {
  const isDark = tone === "dark";

  return (
    <CtaBand
      tone={tone}
      className={className}
      actions={actions}
      title={
        <EditableText
          relUrl={relUrl}
          blockKey={blockKey}
          locale={locale}
          placeholderContent={placeholderContent}
          placeholderTag="h2"
          className={cn(
            "mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl",
            isDark ? "text-white" : "text-brand",
          )}
        />
      }
    />
  );
}
