import { Button } from "./Button";
import { Icon } from "./Icon";
import { Checkbox, PhoneInput, Select, Textarea, TextInput } from "./FormControls";

const languageOptions = [
  { label: "English", value: "english" },
  { label: "Arabic", value: "arabic" },
];

const leadTypeOptions = [
  { label: "Buying / Investing / Other", value: "general" },
  { label: "Buying", value: "buying" },
  { label: "Investing", value: "investing" },
];

const budgetOptions = [
  { label: "Select budget", value: "" },
  { label: "AED 1M - 3M", value: "1-3" },
  { label: "AED 3M - 7M", value: "3-7" },
  { label: "AED 7M+", value: "7-plus" },
];

const timelineOptions = [
  { label: "Select timeline", value: "" },
  { label: "Immediately", value: "immediate" },
  { label: "1-3 months", value: "1-3-months" },
  { label: "Exploring", value: "exploring" },
];

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

function FormHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <p className="text-overline font-semibold text-accent">Step 1 of 2</p>
      <h2 className="mt-3 text-xl font-bold leading-[26px] text-brand">{title}</h2>
      <p className="mt-2 text-body-sm leading-[18px] text-ink-secondary">{subtitle}</p>
    </div>
  );
}

export function PrivateAdvisoryForm() {
  return (
    <FormCard>
      <form className="space-y-5">
        <FormHeader
          title="Request Private Advisory"
          subtitle="Discreet and tailored. An advisor responds within one business day."
        />
        <TextInput label="Full Name" placeholder="Enter your full name" />
        <TextInput label="E-mail Address" type="email" placeholder="you@email.com" />
        <PhoneInput />
        <Textarea label="Your Message" placeholder="Tell us what you're looking for..." />
        <Checkbox label="I agree to receive curated updates from Novel Insight Property." />
        <Button type="submit">Request Private Advisory</Button>
        <p className="text-xs text-ink-tertiary">
          Submissions route to the Zoho lead path. reCAPTCHA on step 2.
        </p>
      </form>
    </FormCard>
  );
}

export function ConsultationRequestForm() {
  return (
    <FormCard>
      <form className="space-y-5">
        <FormHeader
          title="Tell us a little about your Requirement"
          subtitle="A NIP advisor will review your note and respond with the most relevant next step."
        />
        <TextInput label="Name" placeholder="Your name" />
        <PhoneInput label="Phone number" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="Preferred language" options={languageOptions} />
          <Select label="Lead type" options={leadTypeOptions} />
          <Select label="Budget range" options={budgetOptions} />
          <Select label="Timeline" options={timelineOptions} />
        </div>
        <TextInput label="Email address" type="email" placeholder="you@email.com" />
        <Textarea
          label="Message"
          placeholder="Tell us what you are considering, what matters most, or where you would like guidance."
        />
        <Checkbox label="I agree to receive curated updates from Novel Insight Property." />
        <Button type="submit" className="w-full justify-center">
          Submit Consultation Request
        </Button>
        <p className="text-xs text-ink-tertiary">
          Submissions route to the Zoho lead path. reCAPTCHA on step 2.
        </p>
      </form>
    </FormCard>
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
        <Textarea
          label="Abstract"
          placeholder="A short summary of your piece..."
        />
        <div>
          <p className="mb-2 text-xs font-semibold text-ink-secondary">Draft</p>
          <div className="flex flex-col items-center justify-center gap-1 rounded-[var(--radius-field)] border border-dashed border-line bg-sapphire-50 px-6 py-8 text-center">
            <Icon name="upload" className="h-6 w-6 text-brand" />
            <p className="mt-1 text-body-sm leading-[18px] text-ink-secondary">
              Drop your draft here or browse
            </p>
            <p className="text-xs leading-4 text-ink-tertiary">
              PDF or DOCX · max 10MB
            </p>
          </div>
        </div>
        <Button type="submit" className="w-full justify-center">
          Submit for Review
        </Button>
      </form>
    </FormCard>
  );
}
