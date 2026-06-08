import { Button } from "./Button";
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

function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-surface-muted p-6">
      <div className="rounded-[var(--radius-card)] border border-line bg-white p-8">
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
      <p className="text-xs font-bold uppercase text-sapphire-400">Step 1 of 2</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-brand">{title}</h2>
      <p className="mt-2 text-sm text-ink-secondary">{subtitle}</p>
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
        <Button type="submit">Submit Consultation Request</Button>
        <p className="text-xs text-ink-tertiary">
          Submissions route to the Zoho lead path. reCAPTCHA on step 2.
        </p>
      </form>
    </FormCard>
  );
}
