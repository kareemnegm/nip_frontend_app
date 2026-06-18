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
  },
  properties: {
    relUrl: "/properties",
    hero: { eyebrow: "hero-eyebrow", title: "hero-title", description: "hero-description" },
  },
  offPlan: {
    relUrl: "/off-plan",
    hero: { eyebrow: "hero-eyebrow", title: "hero-title", description: "hero-description" },
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
