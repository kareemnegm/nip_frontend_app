import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  PrivateOfficeMemberAdvisorBar,
  PrivateOfficeMemberCuratedSection,
  PrivateOfficeMemberHero,
  PrivateOfficeMemberSavedSection,
} from "@/components/sections/PrivateOfficeMemberSections";

export const metadata: Metadata = {
  title: "Private Office | NIP Reality",
  description:
    "Your private NIP workspace — curated selections, saved properties, and direct access to your advisor.",
};

export default function PrivateOfficeMemberPage() {
  return (
    <SiteShell>
      <PrivateOfficeMemberHero />
      <PrivateOfficeMemberCuratedSection />
      <PrivateOfficeMemberSavedSection />
      <PrivateOfficeMemberAdvisorBar />
    </SiteShell>
  );
}
