"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ContactRequirementForm } from "@/components/forms/ContactRequirementForm";
import { InquiryForm } from "@/components/forms/InquiryForms";
import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/helpers";
import { scrollPageToTop } from "@/lib/navigation/scroll-to-top";
import { Button } from "./Button";
import { Select, Textarea, TextInput } from "./FormControls";

export type ContributeCategoryOption = { label: string; value: string };

/**
 * Only used when `/blog-categories` is unreachable at render time — the live
 * list is passed in from the server. Slugs are the three the backend confirmed
 * for contributor submissions.
 */
const FALLBACK_CATEGORY_OPTIONS: ContributeCategoryOption[] = [
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

type ContributeDraftUploadProps = {
  labelClassName: string;
  file: File | null;
  /** `error` is a client-side rejection; the file is null whenever it is set. */
  onSelect: (file: File | null, error: string | null) => void;
  error?: string;
};

function ContributeDraftUpload({
  labelClassName,
  file,
  onSelect,
  error,
}: ContributeDraftUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function openPicker() {
    inputRef.current?.click();
  }

  function applyFile(next: File | undefined) {
    if (!next) return;
    const validationError = isDraftFileValid(next);
    if (validationError) {
      // Clear the native input too, otherwise the rejected file stays selected
      // and picking the same file again fires no change event.
      if (inputRef.current) inputRef.current.value = "";
      onSelect(null, validationError);
      return;
    }
    onSelect(next, null);
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
            <p className="text-body-xs text-basalt-300">Optional · PDF or DOCX · max 10MB</p>
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

export type ContributeInsightFormProps = {
  /** Live list from `/blog-categories`, already narrowed to contributor slugs. */
  categories?: ContributeCategoryOption[];
};

export function ContributeInsightForm({ categories }: ContributeInsightFormProps) {
  const { locale } = useLocale();
  const router = useRouter();

  const categoryOptions = [
    { label: "Select a category", value: "" },
    ...(categories?.length ? categories : FALLBACK_CATEGORY_OPTIONS),
  ];

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [abstract, setAbstract] = useState("");
  const [draft, setDraft] = useState<File | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);
  const [company, setCompany] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (draftError) return;

    setErrors({});
    setFormError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("author", author);
    formData.append("email", email);
    formData.append("abstract", abstract);
    if (draft) formData.append("draft", draft);
    if (company) formData.append("company", company);

    try {
      const response = await fetch("/api/forms/contribute", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (payload?.errors && typeof payload.errors === "object") {
          const mapped: Record<string, string> = {};
          for (const [field, messages] of Object.entries(payload.errors)) {
            mapped[field] = Array.isArray(messages) ? String(messages[0]) : String(messages);
          }
          setErrors(mapped);
        } else if (response.status === 429) {
          setFormError("You have sent several submissions recently. Please try again later.");
        } else {
          setFormError(payload?.message ?? "Your submission could not be sent. Please try again.");
        }
        return;
      }

      // `data` is null when the honeypot trips — the API still answers 201, so
      // redirect as normal but with no reference to quote.
      const reference: string | undefined = payload?.data?.reference;
      scrollPageToTop();
      router.push(
        localizedHref(
          locale,
          reference ? `/thank-you?ref=${encodeURIComponent(reference)}` : "/thank-you",
        ),
        { scroll: true },
      );
    } catch {
      setFormError("Your submission could not be sent. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full flex-col items-start gap-[18px] rounded-xl border border-line bg-white p-9 lg:max-w-[540px]">
      <form className="flex w-full flex-col items-start gap-[18px]" onSubmit={onSubmit}>
        <input
          type="text"
          name="company"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden
        />

        <TextInput
          label="Article Title"
          labelClassName={fieldLabelClassName}
          placeholder="A clear, specific headline"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={errors.title}
          maxLength={255}
          required
        />
        <Select
          label="Category"
          labelClassName={fieldLabelClassName}
          options={categoryOptions}
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          error={errors.category}
          required
        />
        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
          <TextInput
            label="Author"
            labelClassName={fieldLabelClassName}
            placeholder="Your name"
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            error={errors.author}
            maxLength={255}
            required
          />
          <TextInput
            label="Email"
            labelClassName={fieldLabelClassName}
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={errors.email}
            maxLength={255}
            required
          />
        </div>
        <Textarea
          label="Abstract"
          labelClassName={fieldLabelClassName}
          placeholder="A short summary of your piece..."
          className="min-h-[96px]"
          value={abstract}
          onChange={(event) => setAbstract(event.target.value)}
          error={errors.abstract}
          maxLength={2000}
          required
        />
        <ContributeDraftUpload
          labelClassName={fieldLabelClassName}
          file={draft}
          onSelect={(file, error) => {
            setDraft(file);
            setDraftError(error);
            setErrors((current) => ({ ...current, draft: "" }));
          }}
          error={draftError ?? errors.draft ?? undefined}
        />

        {formError ? (
          <p className="text-body-xs text-error" role="alert">
            {formError}
          </p>
        ) : null}

        <Button type="submit" disabled={loading}>
          {loading ? "Submitting…" : "Submit for Review"}
        </Button>
      </form>
    </div>
  );
}
