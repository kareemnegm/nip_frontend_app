"use client";

import { useTranslations } from "next-intl";
import { MemberAdvisorMessageDialog } from "@/components/forms/MemberAdvisorMessageForm";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Locale } from "@/lib/i18n/config";

export function CuratedAdvisorCta({
  advisorName,
  locale = "en",
  contactHref,
}: {
  advisorName: string;
  locale?: Locale;
  contactHref: string;
}) {
  const t = useTranslations("privateOffice");

  return (
    <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
      <MemberAdvisorMessageDialog
        advisorName={advisorName}
        locale={locale}
        triggerClassName="sm:min-w-[208px]"
      />
      <Button
        href={contactHref}
        variant="primary"
        size="md"
        className="w-full shrink-0 justify-center gap-1 sm:w-auto sm:min-w-[208px]"
      >
        {t("requestPrivateViewing")}
        <Icon name="arrowRight" className="h-4 w-4 rtl:rotate-180" />
      </Button>
    </div>
  );
}
