import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  ContactFormSection,
  ContactHeroSection,
} from "@/components/sections/ContactStorySections";

export const metadata: Metadata = {
  title: "Speak with NIP | NIP Reality",
  description:
    "A considered property decision begins with a conversation. Request a private consultation with NIP advisory.",
};

export default function ContactPage() {
  return (
    <SiteShell>
      <ContactHeroSection />
      <ContactFormSection />
    </SiteShell>
  );
}
