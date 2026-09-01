import "server-only";

import { getBlocksForPage } from "@/lib/api/blocks";
import { CurrencyIcon } from "@/components/ui/CurrencyIcon";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/config";
import { getRequestLocale } from "@/lib/i18n/server";
import { parseMarketPulseStatValue } from "@/lib/market-pulse/stat-value";
import { EditableTextClient, type EditableTag } from "@/components/EditableTextClient";

type MarketPulseStatValueProps = {
  relUrl: string;
  blockKey: string;
  locale?: Locale;
  placeholderContent: string;
  showCurrencyIcon?: boolean;
  className?: string;
};

export async function MarketPulseStatValue({
  relUrl,
  blockKey,
  locale: localeProp,
  placeholderContent,
  showCurrencyIcon = false,
  className,
}: MarketPulseStatValueProps) {
  const locale = localeProp ?? (await getRequestLocale());
  const blocks = await getBlocksForPage(relUrl, locale);
  const block = blocks[blockKey];
  const dbContent = block?.content?.trim() ?? "";
  const hasDbContent = dbContent !== "";
  const effectiveRaw = hasDbContent ? dbContent : placeholderContent;
  const parsed = parseMarketPulseStatValue(effectiveRaw);

  return (
    <p
      className={cn(
        "flex items-center gap-1 text-stat-value-sm font-bold sm:gap-1.5 sm:text-stat-value sm:leading-[25px]",
        className,
      )}
    >
      {showCurrencyIcon ? (
        <CurrencyIcon currency="AED" className="h-5 w-5 shrink-0 sm:h-7 sm:w-7" />
      ) : null}
      <span
        className="relative"
        data-count={parsed.count}
        data-count-suffix={parsed.suffix}
        data-count-decimals={String(parsed.decimals)}
      >
        {parsed.display}
        <EditableTextClient
          relUrl={relUrl}
          blockKey={blockKey}
          locale={locale}
          initialContent={hasDbContent ? dbContent : placeholderContent}
          initialTag={"span" as EditableTag}
        />
      </span>
    </p>
  );
}
