"use client";

import { useRef, useState } from "react";
import { ContactRequirementForm } from "@/components/forms/ContactRequirementForm";
import { InquiryForm } from "@/components/forms/InquiryForms";
import { cn } from "@/lib/cn";
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

const DRAFT_MAX_BYTES = 10 * 1024 * 1024;

function isDraftFileValid(file: File): string | null {
  const name = file.name.toLowerCase();
  if (!name.endsWith(".pdf") && !name.endsWith(".docx")) {
    return "Please upload a PDF or DOCX file.";
  }
  if (file.size > DRAFT_MAX_BYTES) {
    return "File must be 10MB or smaller.";
  }
  return null;
}

function ContributeDraftUpload({ labelClassName }: { labelClassName: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  function openPicker() {
    inputRef.current?.click();
  }

  function applyFile(next: File | undefined) {
    if (!next) return;
    const validationError = isDraftFileValid(next);
    if (validationError) {
      setError(validationError);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }
    setError(null);
    setFile(next);
  }

  return (
    <div className="flex w-full flex-col gap-1.5">
      <p className={labelClassName}>Draft</p>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="sr-only"
        onChange={(event) => applyFile(event.target.files?.[0])}
      />
      <div
        role="button"
        tabIndex={0}
        onClick={openPicker}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPicker();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragOver(false);
          applyFile(event.dataTransfer.files?.[0]);
        }}
        className={cn(
          "flex w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-[var(--radius-card)] border border-dashed py-6 text-center transition",
          dragOver ?
            "border-accent bg-sapphire-100"
          : "border-border-default bg-sapphire-50",
        )}
      >
        {file ? (
          <>
            <p className="max-w-full truncate px-4 text-body-sm font-medium text-brand">{file.name}</p>
            <button
              type="button"
              className="text-body-xs font-medium text-accent underline"
              onClick={(event) => {
                event.stopPropagation();
                openPicker();
              }}
            >
              Replace file
            </button>
          </>
        ) : (
          <>
            <p className="text-body-sm font-medium text-ink-tertiary">
              Drop your draft here or{" "}
              <button
                type="button"
                className="font-medium text-accent underline"
                onClick={(event) => {
                  event.stopPropagation();
                  openPicker();
                }}
              >
                browse
              </button>
            </p>
            <p className="text-body-xs text-basalt-300">PDF or DOCX · max 10MB</p>
          </>
        )}
      </div>
      {error ? (
        <p className="text-body-xs text-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

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
        <ContributeDraftUpload labelClassName={fieldLabelClassName} />
        <Button type="submit">Submit for Review</Button>
      </form>
    </div>
  );
}
