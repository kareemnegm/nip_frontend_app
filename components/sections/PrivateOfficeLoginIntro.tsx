import { EditableText } from "@/components/EditableText";
import { Icon } from "@/components/ui/Icon";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { getRequestLocale } from "@/lib/i18n/server";

const loginBlocks = pageBlockKeys.privateOffice;

export async function PrivateOfficeLoginIntro() {
  const locale = await getRequestLocale();

  return (
    <div className="mt-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white">
        <Icon name="lock" className="h-5 w-5" />
      </span>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
        Private Office
      </p>
      <EditableText
        relUrl={loginBlocks.relUrl}
        blockKey={loginBlocks.login.title}
        locale={locale}
        placeholderContent="Your Private Space"
        placeholderTag="h1"
        className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-brand"
      />
      <EditableText
        relUrl={loginBlocks.relUrl}
        blockKey={loginBlocks.login.description}
        locale={locale}
        placeholderContent="Access is by invitation. Sign in to view your curated selection, saved properties and advisor."
        placeholderTag="p"
        className="mx-auto mt-3 max-w-xs text-sm leading-6 text-ink-secondary"
      />
    </div>
  );
}
