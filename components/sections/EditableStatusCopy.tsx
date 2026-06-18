import { EditableText } from "@/components/EditableText";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getRequestLocale } from "@/lib/i18n/server";

type StatusPage = "thankYou" | "notFound" | "serverError";

const statusBlocks = {
  thankYou: pageBlockKeys.thankYou,
  notFound: pageBlockKeys.notFound,
  serverError: pageBlockKeys.serverError,
} as const;

const placeholderNamespaces: Record<StatusPage, string> = {
  thankYou: "placeholders.thankYou",
  notFound: "placeholders.notFound",
  serverError: "placeholders.serverError",
};

type EditableStatusCopyProps = {
  page: StatusPage;
  eyebrowClassName: string;
  titleClassName: string;
  descriptionClassName: string;
};

export async function EditableStatusCopy({
  page,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
}: EditableStatusCopyProps) {
  const locale = await getRequestLocale();
  const blocks = statusBlocks[page];
  const ns = placeholderNamespaces[page];

  return (
    <>
      <EditableText
        relUrl={blocks.relUrl}
        blockKey={blocks.eyebrow}
        locale={locale}
        placeholderContent={await getCmsPlaceholder(ns, "eyebrow", locale)}
        placeholderTag="p"
        className={eyebrowClassName}
      />
      <EditableText
        relUrl={blocks.relUrl}
        blockKey={blocks.title}
        locale={locale}
        placeholderContent={await getCmsPlaceholder(ns, "title", locale)}
        placeholderTag="h1"
        className={titleClassName}
      />
      <EditableText
        relUrl={blocks.relUrl}
        blockKey={blocks.description}
        locale={locale}
        placeholderContent={await getCmsPlaceholder(ns, "description", locale)}
        placeholderTag="p"
        className={descriptionClassName}
      />
    </>
  );
}
