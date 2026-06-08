import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/sections";
import { Container } from "@/components/ui";
import { ConsultationRequestForm } from "@/components/ui/LeadForms";

export const metadata: Metadata = {
  title: "Speak with NIP | NIP Reality",
};

export default function ContactPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="NIP Private Advisory"
        title="Speak with NIP"
        description="A considered property decision begins with a conversation."
      />

      <section className="w-full bg-surface">
        <Container className="grid gap-10 py-14 sm:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:py-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
              Private Advisory | By Invitation
            </p>
            <p className="mt-5 max-w-md text-sm leading-7 text-ink-secondary sm:text-base">
              {
                "Whether you are exploring Dubai for residence, investment, relocation, portfolio strategy, or a private acquisition, NIP can help you understand the market before you commit to a path."
              }
            </p>
          </div>
          <ConsultationRequestForm />
        </Container>
      </section>
    </SiteShell>
  );
}
