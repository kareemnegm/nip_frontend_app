import { EditableText } from "@/components/EditableText";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { getRequestLocale } from "@/lib/i18n/server";

type StatusPage = "thankYou" | "notFound" | "serverError";

const statusBlocks = {
  thankYou: pageBlockKeys.thankYou,
  notFound: pageBlockKeys.notFound,
  serverError: pageBlockKeys.serverError,
} as const;

type EditableStatusCopyProps = {
  page: StatusPage;
  placeholders: {
    eyebrow: string;
    title: string;
    description: string;
  };
  eyebrowClassName: string;
  titleClassName: string;
  descriptionClassName: string;
};

export async function EditableStatusCopy({
  page,
  placeholders,
  eyebrowClassName,
  titleClassName,
  descriptionClassName,
}: EditableStatusCopyProps) {
  const locale = await getRequestLocale();
  const blocks = statusBlocks[page];

  return (
    <>
      <EditableText
        relUrl={blocks.relUrl}
        blockKey={blocks.eyebrow}
        locale={locale}
        placeholderContent={placeholders.eyebrow}
        placeholderTag="p"
        className={eyebrowClassName}
      />
      <EditableText
        relUrl={blocks.relUrl}
        blockKey={blocks.title}
        locale={locale}
        placeholderContent={placeholders.title}
        placeholderTag="h1"
        className={titleClassName}
      />
      <EditableText
        relUrl={blocks.relUrl}
        blockKey={blocks.description}
        locale={locale}
        placeholderContent={placeholders.description}
        placeholderTag="p"
        className={descriptionClassName}
      />
    </>
  );
}
