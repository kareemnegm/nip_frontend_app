import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/sections";
import { Button, Container, Icon } from "@/components/ui";
import { Select, TextInput, Textarea } from "@/components/ui/FormControls";

export const metadata: Metadata = {
  title: "Contribute an Insight | NIP Reality",
};

const publishPoints = [
  {
    title: "Original Perspective",
    body: "Market analysis, community guides or investment thinking — your own work.",
  },
  {
    title: "Considered Tone",
    body: "Measured, useful and free of promotional language.",
  },
  {
    title: "Editorial Review",
    body: "Our team reviews every submission and may suggest edits before publishing.",
  },
];

const categoryOptions = [
  { label: "Select a category", value: "" },
  { label: "Market Intelligence", value: "market-intelligence" },
  { label: "Investment Guides", value: "investment-guides" },
  { label: "Community Guides", value: "community-guides" },
];

export default function ContributePage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Contribute"
        title="Contribute an Insight"
        description="Share market perspective with the NIP audience. Submissions are reviewed by our editorial team before publication."
      />

      <section className="w-full bg-surface">
        <Container className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:py-20">
          <div>
            <h2 className="text-lg font-bold text-brand">What We Publish</h2>
            <ul className="mt-6 space-y-6">
              {publishPoints.map((point) => (
                <li key={point.title} className="flex gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  <div>
                    <p className="text-sm font-bold text-ink">{point.title}</p>
                    <p className="mt-1 text-sm leading-6 text-ink-secondary">
                      {point.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[var(--radius-card)] border border-line bg-white p-6 sm:p-8">
            <form className="space-y-5">
              <TextInput label="Article Title" placeholder="A clear, specific headline" />
              <Select label="Category" options={categoryOptions} />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput label="Author" placeholder="Your name" />
                <TextInput label="Email" type="email" placeholder="you@email.com" />
              </div>
              <Textarea label="Abstract" placeholder="A short summary of your piece..." />
              <div>
                <p className="mb-2 text-xs font-semibold text-ink-secondary">Draft</p>
                <div className="flex flex-col items-center justify-center gap-1 rounded-[var(--radius-field)] border border-dashed border-line bg-sapphire-50 px-6 py-8 text-center">
                  <Icon name="upload" className="h-6 w-6 text-brand" />
                  <p className="mt-1 text-sm text-ink-secondary">
                    Drop your draft here or browse
                  </p>
                  <p className="text-xs text-ink-tertiary">PDF or DOCX · max 10MB</p>
                </div>
              </div>
              <Button type="submit">Submit for Review</Button>
            </form>
          </div>
        </Container>
      </section>
    </SiteShell>
  );
}
