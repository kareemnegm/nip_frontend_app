import type { IconName } from "@/components/ui/Icon";
import type { BuilderBlockSlot, BuilderDataSource } from "@/types/api/page-builder";

/** Groups shown as tabs in the admin section palette. */
export type SectionGroup = "opening" | "content" | "conversion";

/** Editable filter exposed in the admin for a section's data query. */
export type SectionParamField = {
  key: string;
  label: string;
  type: "select" | "text";
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
};

export type SectionDefinition = {
  type: string;
  label: string;
  description: string;
  dataSource: BuilderDataSource;
  blockSlots: BuilderBlockSlot[];
  placeholderNamespace: string;
  defaultLimit?: number;
  group: SectionGroup;
  icon: IconName;
  /** What staff can change inline on the live page, in plain language. */
  editableSummary: string;
  paramFields?: SectionParamField[];
};

const LISTING_TYPE_FIELD: SectionParamField = {
  key: "listing_type",
  label: "Listing type",
  type: "select",
  options: [
    { label: "Any", value: "" },
    { label: "For sale", value: "sale" },
    { label: "For rent", value: "rent" },
    { label: "Off-plan", value: "offplan" },
  ],
};

export const SECTION_GROUP_LABELS: Record<SectionGroup, string> = {
  opening: "Page opening",
  content: "Content blocks",
  conversion: "Conversion",
};

export const SECTION_REGISTRY: Record<string, SectionDefinition> = {
  hero: {
    type: "hero",
    label: "Hero banner",
    description: "Full-width hero with background image, headline, and call-to-action buttons.",
    dataSource: "none",
    blockSlots: ["eyebrow", "title", "body", "image"],
    placeholderNamespace: "placeholders.builder.hero",
    group: "opening",
    icon: "image",
    editableSummary: "Eyebrow, headline, paragraph, background image",
  },
  "search-strip": {
    type: "search-strip",
    label: "Property search",
    description: "Search bar strip for finding properties.",
    dataSource: "none",
    blockSlots: [],
    placeholderNamespace: "placeholders.builder.searchStrip",
    group: "opening",
    icon: "search",
    editableSummary: "Nothing — fixed search controls",
  },
  "insight-cards": {
    type: "insight-cards",
    label: "Insight cards",
    description: "Carousel of blog articles from the insights catalog.",
    dataSource: "blogs",
    blockSlots: ["title", "desc"],
    placeholderNamespace: "placeholders.builder.featuredInsight",
    defaultLimit: 6,
    group: "content",
    icon: "list",
    editableSummary: "Section heading and intro line",
    paramFields: [
      {
        key: "category",
        label: "Category slug (optional)",
        type: "text",
        placeholder: "market-insights",
      },
    ],
  },
  "property-grid": {
    type: "property-grid",
    label: "Property grid",
    description: "Up to three property cards in a grid with explore button.",
    dataSource: "properties",
    blockSlots: ["title", "desc"],
    placeholderNamespace: "placeholders.builder.curatedCollection",
    defaultLimit: 3,
    group: "content",
    icon: "grid",
    editableSummary: "Section heading and intro line",
    paramFields: [LISTING_TYPE_FIELD],
  },
  "property-carousel": {
    type: "property-carousel",
    label: "Property carousel",
    description: "Property cards in a grid or carousel depending on count.",
    dataSource: "properties",
    blockSlots: ["title", "desc"],
    placeholderNamespace: "placeholders.builder.featuredSelection",
    defaultLimit: 6,
    group: "content",
    icon: "building",
    editableSummary: "Section heading and intro line",
    paramFields: [LISTING_TYPE_FIELD],
  },
  communities: {
    type: "communities",
    label: "Communities",
    description: "Area cards showcasing Dubai communities.",
    dataSource: "areas",
    blockSlots: ["title", "desc"],
    placeholderNamespace: "placeholders.builder.communities",
    defaultLimit: 9,
    group: "content",
    icon: "communities",
    editableSummary: "Section heading and intro line",
  },
  "market-pulse": {
    type: "market-pulse",
    label: "Market pulse",
    description: "Statistics band with heading and link to insights.",
    dataSource: "none",
    blockSlots: ["title", "desc"],
    placeholderNamespace: "placeholders.builder.marketPulse",
    group: "content",
    icon: "percent",
    editableSummary: "Heading, intro, stat cards, and insights link",
  },
  "private-office": {
    type: "private-office",
    label: "Private Office promo",
    description: "Dark band promoting Private Office access.",
    dataSource: "none",
    blockSlots: ["title", "desc"],
    placeholderNamespace: "placeholders.builder.privateOffice",
    group: "conversion",
    icon: "lock",
    editableSummary: "Heading and supporting line",
  },
  cta: {
    type: "cta",
    label: "Call to action",
    description: "Heading with Speak with NIP and Concierge buttons.",
    dataSource: "none",
    blockSlots: ["title", "desc"],
    placeholderNamespace: "placeholders.builder.cta",
    group: "conversion",
    icon: "send",
    editableSummary: "Heading and supporting line",
  },
  "cta-band": {
    type: "cta-band",
    label: "CTA band",
    description: "Dark advisory band with editable heading.",
    dataSource: "none",
    blockSlots: ["title"],
    placeholderNamespace: "placeholders.builder.ctaBand",
    group: "conversion",
    icon: "concierge",
    editableSummary: "Heading only",
  },
};

export const SECTION_TYPES = Object.keys(SECTION_REGISTRY);

export function getSectionDefinition(type: string): SectionDefinition | undefined {
  return SECTION_REGISTRY[type];
}

export function getSectionLabel(type: string): string {
  return SECTION_REGISTRY[type]?.label ?? type;
}
