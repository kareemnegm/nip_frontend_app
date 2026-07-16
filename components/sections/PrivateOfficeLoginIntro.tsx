import { getTranslations } from "next-intl/server";
import { EditableText } from "@/components/EditableText";
import { Icon } from "@/components/ui/Icon";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getRequestLocale } from "@/lib/i18n/server";

const loginBlocks = pageBlockKeys.privateOffice;

/** Figma node 1525:27708 — lock badge + "PRIVATE OFFICE" overline + Didot H1 + description. */
export async function PrivateOfficeLoginIntro() {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "privateOffice" });

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-sapphire-600 text-white">
        <Icon name="lock" className="h-9 w-9" />
      </span>
      <p className="text-overline font-semibold uppercase text-platinum-600">
        {t("title")}
      </p>
      <EditableText
        relUrl={loginBlocks.relUrl}
        blockKey={loginBlocks.login.title}
        locale={locale}
        placeholderContent={await getCmsPlaceholder("placeholders.privateOffice.login", "title", locale)}
        placeholderTag="h1"
        className="text-property-h1"
      />
      <EditableText
        relUrl={loginBlocks.relUrl}
        blockKey={loginBlocks.login.description}
        locale={locale}
        placeholderContent={await getCmsPlaceholder("placeholders.privateOffice.login", "description", locale)}
        placeholderTag="p"
        className="max-w-[360px] text-body-sm text-ink-tertiary"
      />
    </div>
  );
}
