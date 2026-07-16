"use client";

import { ContactRequirementForm } from "@/components/forms/ContactRequirementForm";
import { InquiryForm } from "@/components/forms/InquiryForms";
import { Button } from "./Button";
import { Select, Textarea, TextInput } from "./FormControls";

const insightCategoryOptions = [
  { label: "Select a category", value: "" },
  { label: "Market Intelligence", value: "market-intelligence" },
  { label: "Investment Guides", value: "investment-guides" },
  { label: "Community Guides", value: "community-guides" },
];

/** Figma "04 Label/Small" (11/14/500) — compact field labels on the Contribute form card. */
const fieldLabelClassName = "text-label-muted font-medium text-ink-secondary";

export function PrivateAdvisoryForm() {
  return <InquiryForm variant="privateAdvisory" />;
}

export function ContactRequestForm() {
  return <ContactRequirementForm />;
}

export function ConsultationRequestForm() {
  return <InquiryForm variant="consultation" />;
}

export function ContributeInsightForm() {
  return (
    <div className="flex w-full flex-col items-start gap-[18px] rounded-xl border border-line bg-white p-9 lg:max-w-[540px]">
      <form className="flex w-full flex-col items-start gap-[18px]">
        <TextInput
          label="Article Title"
          labelClassName={fieldLabelClassName}
          placeholder="A clear, specific headline"
        />
        <Select label="Category" labelClassName={fieldLabelClassName} options={insightCategoryOptions} />
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <TextInput label="Author" labelClassName={fieldLabelClassName} placeholder="Your name" />
          <TextInput
            label="Email"
            labelClassName={fieldLabelClassName}
            type="email"
            placeholder="you@email.com"
          />
        </div>
        <Textarea
          label="Abstract"
          labelClassName={fieldLabelClassName}
          placeholder="A short summary of your piece..."
          className="min-h-[96px]"
        />
        <div className="flex w-full flex-col gap-1.5">
          <p className={fieldLabelClassName}>Draft</p>
          <div className="flex w-full flex-col items-center justify-center gap-1 rounded-[var(--radius-card)] border border-dashed border-border-default bg-sapphire-50 py-6 text-center">
            <p className="text-body-sm font-medium text-ink-tertiary">
              Drop your draft here or browse
            </p>
            <p className="text-body-xs text-basalt-300">PDF or DOCX · max 10MB</p>
          </div>
        </div>
        <Button type="submit">Submit for Review</Button>
      </form>
    </div>
  );
}
