"use client";

import Link from "next/link";
import { AdminSiteShell } from "@/components/admin/AdminSiteShell";
import { useLocale } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/helpers";

const cards = [
  {
    href: "/admin/site/seo",
    title: "Page SEO",
    description:
      "Meta title, description, and keywords for marketing pages (Home, About, Properties, etc.).",
  },
  {
    href: "/admin/site/footer",
    title: "Footer link labels",
    description: "Rename footer column headers and link text. URLs stay the same on the live site until backend sync is complete.",
  },
  {
    href: "/admin/site/navigation",
    title: "Menu link labels",
    description: "Rename header menu and dropdown labels, plus SEO for each destination page.",
  },
] as const;

export default function AdminSiteHubPage() {
  const { locale } = useLocale();

  return (
    <AdminSiteShell title="Site content">
      <p className="max-w-2xl text-body-regular text-ink-secondary">
        Rename footer and menu labels and manage search-engine meta tags. The live site
        always keeps its standard links — dashboard changes apply when saved to the
        backend.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={localizedHref(locale, card.href)}
            className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)] transition-colors hover:border-brand"
          >
            <h2 className="text-body-lg font-semibold text-ink">{card.title}</h2>
            <p className="mt-2 text-body-sm text-ink-secondary">{card.description}</p>
          </Link>
        ))}
      </div>
    </AdminSiteShell>
  );
}
