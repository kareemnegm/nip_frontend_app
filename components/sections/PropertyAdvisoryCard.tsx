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
          "mx-auto flex w-full max-w-[312px] shrink-0 flex-col gap-6 rounded-[var(--radius-card)] border border-line bg-sapphire-50 p-6 lg:mx-0 lg:sticky lg:top-28 lg:self-start",
          className,
        )}
      >
        <p className="text-label-muted font-medium text-accent">{labels.eyebrow}</p>
        <p className="text-body-sm text-ink-tertiary">{labels.description}</p>

        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand">
            <span className="font-[family-name:var(--font-logo)] text-label-semibold font-medium text-white">
              NIP
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-label-semibold font-semibold text-brand">{labels.advisoryName}</p>
            <p className="text-body-xs text-basalt-300">{labels.advisoryResponds}</p>
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
