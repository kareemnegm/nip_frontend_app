import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { StickyCta } from "@/components/StickyCta";
import {
  AdvisorCard,
  Button,
  CommunityCard,
  ConsultationRequestForm,
  Container,
  FactsStrip,
  GenericSearchBar,
  InsightCard,
  OffPlanCard,
  PrivateAdvisoryForm,
  PropertyCard,
  PropertyFilterBar,
  TextInput,
} from "@/components/ui";

const propertyFacts = [
  { label: "Bedrooms", value: "2", icon: "bed" as const },
  { label: "Bathrooms", value: "3", icon: "bath" as const },
  { label: "Total Area", value: "2,315 sq ft", icon: "home" as const },
  { label: "Property Type", value: "Apartment", icon: "building" as const },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-ink">
      <Header />
      <StickyCta />

      <main className="py-12">
        <Container className="space-y-16">
          <section>
            <p className="text-sm font-bold uppercase tracking-wide text-sapphire-400">
              Components - NIP Design System
            </p>
            <h1 className="mt-2 text-5xl font-bold tracking-tight text-brand">
              Component Library
            </h1>
            <p className="mt-3 max-w-2xl text-base text-ink-secondary">
              Shared components built from the Figma screenshots: buttons,
              search, facts strips, cards, lead forms, header, sticky CTA, and
              footer.
            </p>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-brand">Buttons</h2>
            <div className="rounded-lg bg-surface-muted p-6">
              <div className="flex flex-wrap gap-4">
                <Button>Speak with NIP</Button>
                <Button variant="secondary">Speak with NIP</Button>
                <Button variant="light">Speak with NIP</Button>
                <Button variant="muted">Request Details</Button>
                <Button variant="outline">Speak with NIP</Button>
                <Button variant="link">Explore Property</Button>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-brand">Search / Filter Bar</h2>
            <PropertyFilterBar />
            <GenericSearchBar />
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-brand">Property / Facts Strip</h2>
            <div className="rounded-lg bg-surface-muted p-6">
              <FactsStrip items={propertyFacts} />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-brand">Input Field</h2>
            <div className="max-w-md rounded-lg bg-surface-muted p-6">
              <TextInput label="Full Name" placeholder="Enter your full name" />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-brand">Cards</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <PropertyCard
                title="Property Name"
                location="Sheikh Zayed Road, Dubai"
                price="AED 2,658,000"
              />
              <InsightCard
                category="Market Intelligence"
                title="The Article's Headline"
                excerpt="The article's stand-first: a one-to-two-line summary of the article."
              />
              <OffPlanCard
                title="Residences Name"
                location="Palm Jumeirah | Emaar"
                price="AED 4,710,000"
              />
              <AdvisorCard
                title="Selected for You by your Advisor"
                excerpt="A confidential selection aligned to your mandate."
              />
              <CommunityCard
                title="Community Name"
                facts={[
                  "Family Oriented",
                  "Blue Metro Line",
                  "Green Area & Parks",
                  "Retails & Outlets",
                ]}
              />
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold text-brand">Forms</h2>
            <div className="grid gap-6 lg:grid-cols-2">
              <PrivateAdvisoryForm />
              <ConsultationRequestForm />
            </div>
          </section>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
