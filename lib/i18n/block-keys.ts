import type { Locale } from "./config";

/**
 * Central registry of CMS block keys per static page.
 * relUrl values are locale-agnostic (no /en or /ar prefix).
 */
export const pageBlockKeys = {
  home: {
    relUrl: "/",
    hero: {
      eyebrow: "hero-eyebrow",
      title: "hero-title",
      body: "hero-body",
      image: "hero-image",
    },
    featuredInsight: {
      title: "featured-insight-title",
      desc: "featured-insight-desc",
    },
    curatedCollection: {
      title: "curated-collection-title",
      desc: "curated-collection-desc",
    },
    marketPulse: {
      title: "market-pulse-title",
      desc: "market-pulse-desc",
    },
    privateOffice: {
      title: "private-office-title",
      desc: "private-office-desc",
    },
    featuredSelection: {
      title: "featured-selection-title",
      desc: "featured-selection-desc",
    },
    cta: {
      title: "home-cta-title",
      desc: "home-cta-desc",
    },
  },
  about: {
    relUrl: "/about",
    hero: { eyebrow: "hero-eyebrow", title: "hero-title", description: "hero-description" },
    market: { title: "market-title", body: "market-body" },
    role: {
      eyebrow: "role-eyebrow",
      title: "role-title",
      body: "role-body",
      image: "role-image",
    },
    partners: {
      caption: "partners-caption",
      logo1: "partner-logo-1",
      logo2: "partner-logo-2",
      logo3: "partner-logo-3",
      logo4: "partner-logo-4",
      logo5: "partner-logo-5",
    },
    standard: { title: "standard-title", quote: "standard-quote" },
  },
  properties: {
    relUrl: "/properties",
    /* Figma properties listing hero has eyebrow + title only — no description line */
    hero: { eyebrow: "hero-eyebrow", title: "hero-title" },
  },
  offPlan: {
    relUrl: "/off-plan",
    hero: { eyebrow: "hero-eyebrow", title: "hero-title", description: "hero-description" },
    /** Shared bottom CTA heading rendered on every off-plan project detail page (/off-plan/{slug}) */
    detailCta: { title: "detail-cta-title" },
  },
  areas: {
    relUrl: "/areas",
    hero: { eyebrow: "hero-eyebrow", title: "hero-title", description: "hero-description" },
    cta: { title: "cta-title" },
  },
  developers: {
    relUrl: "/developers",
    hero: { eyebrow: "hero-eyebrow", title: "hero-title", description: "hero-description" },
    cta: { title: "cta-title" },
  },
  insights: {
    relUrl: "/insights",
    hero: { eyebrow: "hero-eyebrow", title: "hero-title", description: "hero-description" },
    cta: { title: "cta-title" },
  },
  faq: {
    relUrl: "/faq",
    hero: { eyebrow: "hero-eyebrow", title: "hero-title", description: "hero-description" },
    cta: { title: "cta-title", description: "cta-description" },
  },
  contact: {
    relUrl: "/contact",
    hero: { eyebrow: "hero-eyebrow", title: "hero-title", description: "hero-description" },
    intro: { overline: "form-intro-overline", body: "form-intro-body" },
  },
  contribute: {
    relUrl: "/contribute",
    hero: { eyebrow: "hero-eyebrow", title: "hero-title", description: "hero-description" },
    sidebar: { title: "sidebar-title" },
  },
  legal: {
    relUrl: "/legal",
    hero: { eyebrow: "hero-eyebrow", title: "hero-title", lastUpdated: "hero-last-updated" },
    sidebar: { title: "sidebar-title" },
    complianceImage: "compliance-image",
    sections: {
      overview: { title: "section-overview-title", body: "section-overview-body" },
      "information-we-collect": {
        title: "section-information-we-collect-title",
        body: "section-information-we-collect-body",
      },
      "how-we-use-it": { title: "section-how-we-use-it-title", body: "section-how-we-use-it-body" },
      "sharing-disclosure": {
        title: "section-sharing-disclosure-title",
        body: "section-sharing-disclosure-body",
      },
      "data-retention": { title: "section-data-retention-title", body: "section-data-retention-body" },
      "your-rights": { title: "section-your-rights-title", body: "section-your-rights-body" },
      contact: { title: "section-contact-title", body: "section-contact-body" },
    },
  },
  concierge: {
    relUrl: "/concierge",
    hero: { eyebrow: "hero-eyebrow", title: "hero-title", description: "hero-description" },
  },
  curated: {
    relUrl: "/curated",
    hero: {
      eyebrow: "hero-eyebrow",
      badge: "hero-badge",
      title: "hero-title",
      description: "hero-description",
    },
    selection: {
      eyebrow: "selection-eyebrow",
      title: "selection-title",
      description: "selection-description",
    },
    notes: {
      eyebrow: "notes-eyebrow",
      title: "notes-title",
      description: "notes-description",
    },
  },
  privateOffice: {
    relUrl: "/private-office",
    login: { title: "login-title", description: "login-description" },
  },
  thankYou: {
    relUrl: "/thank-you",
    eyebrow: "status-eyebrow",
    title: "status-title",
    description: "status-description",
  },
  notFound: {
    relUrl: "/404",
    eyebrow: "status-eyebrow",
    title: "status-title",
    description: "status-description",
  },
  serverError: {
    relUrl: "/500",
    eyebrow: "status-eyebrow",
    title: "status-title",
    description: "status-description",
  },
} as const;

export type PageBlockKeys = typeof pageBlockKeys;

export function getPageBlocks(page: keyof PageBlockKeys) {
  return pageBlockKeys[page];
}

/** Footer marketing copy (global, keyed under relUrl `/global`). */
export const globalBlockKeys = {
  relUrl: "/global",
  footer: {
    tagline: "footer-tagline",
    newsletterTitle: "footer-newsletter-title",
    newsletterDesc: "footer-newsletter-desc",
    copyright: "footer-copyright",
  },
} as const;

export type EditableBlockRef = {
  relUrl: string;
  blockKey: string;
  locale?: Locale;
};
