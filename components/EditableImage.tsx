import "server-only";

import Image from "next/image";
import { getBlocksForPage } from "@/lib/api/blocks";
import type { Locale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";
import { cn } from "@/lib/cn";
import { EditableImageClient } from "./EditableImageClient";

export type EditableImageProps = {
  relUrl: string;
  blockKey: string;
  locale?: Locale;
  placeholderUrl?: string;
  placeholderAlt?: string;
  className?: string;
  imageClassName?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
};

export async function EditableImage({
  relUrl,
  blockKey,
  locale: localeProp,
  placeholderUrl = "/images/placeholder.jpg",
  placeholderAlt = "",
  className,
  imageClassName,
  width = 1200,
  height = 800,
  fill = false,
  priority = false,
}: EditableImageProps) {
  const locale = localeProp ?? (await getRequestLocale());
  const blocks = await getBlocksForPage(relUrl, locale);
  const block = blocks[blockKey];
  const dbUrl = block?.content?.trim() ?? "";
  const src = dbUrl || placeholderUrl;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {src ? (
        fill ? (
          <Image
            src={src}
            alt={placeholderAlt}
            fill
            priority={priority}
            className={cn("object-cover", imageClassName)}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <Image
            src={src}
            alt={placeholderAlt}
            width={width}
            height={height}
            priority={priority}
            className={cn("h-auto w-full object-cover", imageClassName)}
          />
        )
      ) : null}
      <EditableImageClient
        relUrl={relUrl}
        blockKey={blockKey}
        locale={locale}
        initialUrl={dbUrl}
      />
    </div>
  );
}
