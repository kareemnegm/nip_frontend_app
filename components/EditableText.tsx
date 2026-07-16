import "server-only";

import { cookies } from "next/headers";
import type { ElementType } from "react";
import { getBlocksForPage } from "@/lib/api/blocks";
import { CMS_TOKEN_COOKIE } from "@/lib/cms/session.client";
import { cn } from "@/lib/cn";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/config";
import { resolveLocale } from "@/lib/i18n/helpers";
import { getRequestLocale } from "@/lib/i18n/server";
import { EditableTextClient, type EditableTag } from "./EditableTextClient";

const TAGS = [
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "div",
  "span",
  "small",
  "blockquote",
  "ul",
  "ol",
  "li",
] as const;

type Tag = (typeof TAGS)[number];

function isTag(value: unknown): value is Tag {
  return typeof value === "string" && (TAGS as readonly string[]).includes(value);
}

export type EditableTextProps = {
  relUrl: string;
  blockKey: string;
  locale?: Locale;
  placeholderContent?: string;
  placeholderTag?: string;
  className?: string;
  adminOnly?: boolean;
};

export async function EditableText({
  relUrl,
  blockKey,
  locale: localeProp,
  placeholderContent,
  placeholderTag,
  className,
  adminOnly,
}: EditableTextProps) {
  if (adminOnly) {
    const cookieStore = await cookies();
    if (!cookieStore.get(CMS_TOKEN_COOKIE)?.value) {
      return null;
    }
  }

  const locale = localeProp ?? (await getRequestLocale());
  const blocks = await getBlocksForPage(relUrl, locale);
  const block = blocks[blockKey];
  const dbContent = block?.content ?? null;
  const dbElementTag = block?.elementTag;
  const dbTag: Tag = isTag(dbElementTag) ? dbElementTag : "p";

  const trimmedDb = (dbContent ?? "").trim();
  const hasDbContent = trimmedDb !== "";
  const effectiveContent = hasDbContent ? trimmedDb : (placeholderContent ?? null);
  const tag: Tag = hasDbContent
    ? dbTag
    : isTag(placeholderTag)
      ? placeholderTag
      : "p";

  const TagComponent = tag as ElementType;

  return (
    <TagComponent className={cn(className, "relative")}>
      {effectiveContent}
      <EditableTextClient
        relUrl={relUrl}
        blockKey={blockKey}
        locale={locale}
        initialContent={hasDbContent ? (dbContent ?? "") : ""}
        initialTag={tag as EditableTag}
      />
    </TagComponent>
  );
}

/** @deprecated use getRequestLocale from lib/i18n/server */
export async function getEditableLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  return resolveLocale(cookieStore.get(LOCALE_COOKIE)?.value);
}
