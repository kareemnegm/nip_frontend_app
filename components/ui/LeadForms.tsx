"use client";

import { InquiryForm } from "@/components/forms/InquiryForms";
import { Button } from "./Button";
import { Select, Textarea, TextInput } from "./FormControls";
import { Icon } from "./Icon";

const insightCategoryOptions = [
  { label: "Select a category", value: "" },
  { label: "Market Intelligence", value: "market-intelligence" },
  { label: "Investment Guides", value: "investment-guides" },
  { label: "Community Guides", value: "community-guides" },
];

function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] bg-sapphire-50 p-6">
      <div className="rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-card)]">
        {children}
      </div>
    </div>
  );
}

export function PrivateAdvisoryForm() {
  return (
    <InquiryForm
      variant="consultation"
      title="Request Private Advisory"
      subtitle="Discreet and tailored. An advisor responds within one business day."
      submitLabel="Request Private Advisory"
    />
  );
}

export function ContactRequestForm() {
  return (
    <InquiryForm
      variant="contact"
      title="Tell us a little about your Requirement"
      subtitle="A NIP advisor will review your note and respond with the most relevant next step."
      submitLabel="Send Message"
    />
  );
}

export function ConsultationRequestForm() {
  return (
    <InquiryForm
      variant="consultation"
      title="Tell us a little about your Requirement"
      subtitle="A NIP advisor will review your note and respond with the most relevant next step."
      submitLabel="Submit Consultation Request"
    />
  );
}

export function ContributeInsightForm() {
  return (
    <FormCard>
      <form className="space-y-5">
        <TextInput label="Article Title" placeholder="A clear, specific headline" />
        <Select label="Category" options={insightCategoryOptions} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput label="Author" placeholder="Your name" />
          <TextInput label="Email" type="email" placeholder="you@email.com" />
        </div>
        <Textarea label="Abstract" placeholder="A short summary of your piece..." />
        <div>
          <p className="mb-2 text-xs font-semibold text-ink-secondary">Draft</p>
          <div className="flex flex-col items-center justify-center gap-1 rounded-[var(--radius-field)] border border-dashed border-line bg-sapphire-50 px-6 py-8 text-center">
            <Icon name="upload" className="h-6 w-6 text-brand" />
            <p className="mt-1 text-body-sm leading-[18px] text-ink-secondary">
              Drop your draft here or browse
            </p>
            <p className="text-xs leading-4 text-ink-tertiary">PDF or DOCX · max 10MB</p>
          </div>
        </div>
        <Button type="submit" className="w-full justify-center">
          Submit for Review
        </Button>
      </form>
    </FormCard>
  );
}
