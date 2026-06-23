"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PropertyInquiryForm } from "@/components/forms/InquiryForms";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/cn";
import { clientT } from "@/lib/i18n/client-messages";
import { useOptionalLocale } from "@/lib/i18n/context";

type OffPlanInquiryModalProps = {
  propertyId: number;
  pageUrl: string;
  modalTitle: string;
  open: boolean;
  onClose: () => void;
};

function OffPlanInquiryModal({
  propertyId,
  pageUrl,
  modalTitle,
  open,
  onClose,
}: OffPlanInquiryModalProps) {
  const tCommon = useTranslations("common");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={modalTitle}
      closeLabel={tCommon("close")}
    >
      <PropertyInquiryForm propertyId={propertyId} pageUrl={pageUrl} />
    </Modal>
  );
}

export function OffPlanRegisterInterestButton({
  propertyId,
  pageUrl,
  label,
  modalTitle,
  className,
}: {
  propertyId: number;
  pageUrl: string;
  label: string;
  modalTitle: string;
  className?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant="primary"
        className={cn("w-full sm:w-auto", className)}
        onClick={() => setModalOpen(true)}
      >
        {label}
      </Button>
      <OffPlanInquiryModal
        propertyId={propertyId}
        pageUrl={pageUrl}
        modalTitle={modalTitle}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}

function SpeakWithNipWhiteButton({
  className,
  onClick,
}: {
  className?: string;
  onClick: () => void;
}) {
  const localeContext = useOptionalLocale();

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-[3px] rounded-[var(--radius-field)] bg-white px-6 py-[9px] text-xs leading-4 text-brand transition-colors hover:bg-white/90",
        className,
      )}
    >
      <span className="font-semibold">
        {clientT(localeContext?.locale, "common", "speakWith")}
      </span>
      <span className="font-[family-name:var(--font-logo)] font-medium">
        {clientT(localeContext?.locale, "common", "nip")}
      </span>
    </button>
  );
}

export function OffPlanRegisterInterestCta({
  propertyId,
  pageUrl,
  eyebrow,
  title,
  modalTitle,
  className,
}: {
  propertyId: number;
  pageUrl: string;
  eyebrow: string;
  title: string;
  modalTitle: string;
  className?: string;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className={cn("bg-brand py-16", className)}>
        <div className="mx-auto flex w-full max-w-[1080px] flex-col items-center gap-6 px-6 text-center">
          <p className="text-[11px] font-medium uppercase leading-[14px] tracking-[0.08em] text-[#8fb0dc]">
            {eyebrow}
          </p>
          <h2 className="max-w-[720px] font-[family-name:var(--font-display)] text-[44px] uppercase leading-[52px] tracking-[-0.04em] text-white">
            {title}
          </h2>
          <SpeakWithNipWhiteButton onClick={() => setModalOpen(true)} />
        </div>
      </section>
      <OffPlanInquiryModal
        propertyId={propertyId}
        pageUrl={pageUrl}
        modalTitle={modalTitle}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
