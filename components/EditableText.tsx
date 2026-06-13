import { cookies } from "next/headers";
import type { ElementType } from "react";
import { getBlocksForPage } from "@/lib/api/blocks";
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
  placeholderContent?: string;
  placeholderTag?: string;
  className?: string;
  adminOnly?: boolean;
};

export async function EditableText({
  relUrl,
  blockKey,
  placeholderContent,
  placeholderTag,
  className,
  adminOnly,
}: EditableTextProps) {
  if (adminOnly) {
    const cookieStore = await cookies();
    if (cookieStore.get("admin")?.value !== "1") {
      return null;
    }
  }

  const blocks = await getBlocksForPage(relUrl);
  const block = blocks[blockKey];
  const dbContent = block?.content ?? null;
  const dbElementTag = block?.elementTag;
  const dbTag: Tag = isTag(dbElementTag) ? dbElementTag : "p";

  const hasDbContent =
    dbContent !== null && dbContent !== undefined && dbContent !== "";
  const effectiveContent = hasDbContent ? dbContent : (placeholderContent ?? null);
  const tag: Tag = hasDbContent
    ? dbTag
    : isTag(placeholderTag)
      ? placeholderTag
      : "p";

  const TagComponent = tag as ElementType;

  return (
    <TagComponent className={className} style={{ position: "relative" }}>
      {effectiveContent}
      <EditableTextClient
        relUrl={relUrl}
        blockKey={blockKey}
        initialContent={hasDbContent ? (dbContent ?? "") : ""}
        initialTag={tag as EditableTag}
      />
    </TagComponent>
  );
}
