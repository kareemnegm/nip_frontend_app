"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PropertyInquiryForm } from "@/components/forms/InquiryForms";
import { Button, SpeakWithNipButton } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";

export type PropertyAdvisoryCardLabels = {
  eyebrow: string;
  description: string;
  advisoryName: string;
  advisoryResponds: string;
  requestDetails: string;
  modalTitle: string;
};

export function PropertyAdvisoryCard({
  propertyId,
  pageUrl,
  labels,
  className,
}: {
  propertyId: number;
  pageUrl: string;
  labels: PropertyAdvisoryCardLabels;
  className?: string;
}) {
  const tCommon = useTranslations("common");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <aside
        className={cn(
          "flex w-full max-w-[312px] shrink-0 flex-col gap-6 rounded-[var(--radius-card)] border border-[#dbe0ec] bg-sapphire-50 p-6 lg:sticky lg:top-28 lg:self-start",
          className,
        )}
      >
        <p className="text-[11px] font-medium leading-[14px] text-accent">{labels.eyebrow}</p>
        <p className="text-body-sm leading-[18px] text-ink-tertiary">{labels.description}</p>

        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand px-2">
            <span className="font-[family-name:var(--font-logo)] text-[10px] font-medium leading-none text-white">
              NIP
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold leading-4 text-brand">{labels.advisoryName}</p>
            <p className="text-xs leading-4 text-basalt-300">{labels.advisoryResponds}</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            type="button"
            variant="accent"
            className="w-full justify-center"
            onClick={() => setModalOpen(true)}
          >
            {labels.requestDetails}
          </Button>
          <SpeakWithNipButton className="w-full justify-center" />
        </div>
      </aside>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={labels.modalTitle}
        closeLabel={tCommon("close")}
      >
        <PropertyInquiryForm propertyId={propertyId} pageUrl={pageUrl} />
      </Modal>
    </>
  );
}
