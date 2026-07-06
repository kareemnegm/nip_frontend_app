import type { Locale } from "@/lib/i18n/config";
import type { NavigationItem, NavigationPayload, NavigationZone } from "@/types/api/navigation";
import en from "@/messages/en.json";
import ar from "@/messages/ar.json";
import {
  HEADER_PARENT_KEYS,
  NAV_ZONE_KEYS,
} from "./zone-keys";
import { resolveSeoPath } from "./seo-path";
import {
  mainNavItems,
  propertiesDropdownItems,
  offPlanDropdownItems,
} from "@/lib/i18n/nav-config";

type FooterMessages = typeof en.footer;
type NavMessages = typeof en.nav;

function footerMessages(locale: Locale): FooterMessages {
  return locale === "ar" ? ar.footer : en.footer;
}

function navMessages(locale: Locale): NavMessages {
  return locale === "ar" ? ar.nav : en.nav;
}

function zoneId(key: string, locale: Locale) {
  return `default-zone-${key}-${locale}`;
}

function itemId(zoneKey: string, href: string, locale: Locale, parentKey?: string | null) {
  const suffix = parentKey ? `${parentKey}-` : "";
  return `default-item-${zoneKey}-${suffix}${href}-${locale}`.replace(/[^a-zA-Z0-9-_]/g, "_");
}

function makeItem(
  zoneKey: string,
  locale: Locale,
  label: string,
  href: string,
  sortOrder: number,
  options: {
    parent_key?: string | null;
    icon?: string | null;
    open_in_new_tab?: boolean;
    seo_path?: string | null;
  } = {},
): NavigationItem {
  return {
    id: itemId(zoneKey, href, locale, options.parent_key),
    zone_key: zoneKey,
    locale,
    label,
    href,
    icon: options.icon ?? null,
    parent_key: options.parent_key ?? null,
    sort_order: sortOrder,
    is_visible: true,
    open_in_new_tab: options.open_in_new_tab ?? href.startsWith("http"),
    seo_path: options.seo_path ?? resolveSeoPath(href),
  };
}

function makeZone(
  key: string,
  locale: Locale,
  title: string,
  sortOrder: number,
): NavigationZone {
  return {
    id: zoneId(key, locale),
    key,
    locale,
    title,
    sort_order: sortOrder,
    is_visible: true,
  };
}

function buildFooterZones(locale: Locale, f: FooterMessages): NavigationZone[] {
  return [
    makeZone(NAV_ZONE_KEYS.FOOTER_PROPERTIES, locale, f.properties, 1),
    makeZone(NAV_ZONE_KEYS.FOOTER_AREAS, locale, f.areas, 2),
    makeZone(NAV_ZONE_KEYS.FOOTER_OFF_PLAN, locale, f.offPlan, 3),
    makeZone(NAV_ZONE_KEYS.FOOTER_RESOURCES, locale, f.resources, 4),
    makeZone(NAV_ZONE_KEYS.FOOTER_INSIGHTS, locale, f.insights, 5),
    makeZone(NAV_ZONE_KEYS.FOOTER_ABOUT, locale, f.aboutNip, 6),
    makeZone(NAV_ZONE_KEYS.FOOTER_FOLLOW_US, locale, f.followUs, 7),
    makeZone(NAV_ZONE_KEYS.FOOTER_LEGAL, locale, "Legal", 8),
  ];
}

function buildFooterItems(locale: Locale, f: FooterMessages): NavigationItem[] {
  const items: NavigationItem[] = [];

  const propertiesLinks = [
    { label: f.buyProperties, href: "/properties?listing=sale" },
    { label: f.rentProperties, href: "/properties?listing=rent" },
    { label: f.exclusives, href: "/properties?exclusive=1" },
    { label: f.newLaunches, href: "/off-plan" },
  ];
  propertiesLinks.forEach((link, i) => {
    items.push(
      makeItem(NAV_ZONE_KEYS.FOOTER_PROPERTIES, locale, link.label, link.href, i + 1),
    );
  });

  const areasLinks = [
    { label: f.palmJumeirah, href: "/areas/palm-jumeirah" },
    { label: f.dubaiMarina, href: "/areas/dubai-marina" },
    { label: f.downtown, href: "/areas/downtown-dubai" },
    { label: f.businessBay, href: "/areas/business-bay" },
    { label: f.allAreas, href: "/areas" },
  ];
  areasLinks.forEach((link, i) => {
    items.push(makeItem(NAV_ZONE_KEYS.FOOTER_AREAS, locale, link.label, link.href, i + 1));
  });

  const offPlanLinks = [
    { label: f.featuredProjects, href: "/off-plan?featured=1" },
    { label: f.upcoming, href: "/off-plan?status=launching" },
    { label: f.paymentPlans, href: "/off-plan" },
    { label: f.developersLink, href: "/developers" },
  ];
  offPlanLinks.forEach((link, i) => {
    items.push(makeItem(NAV_ZONE_KEYS.FOOTER_OFF_PLAN, locale, link.label, link.href, i + 1));
  });

  const resourcesLinks = [
    { label: f.faq, href: "/faq" },
    { label: f.aiConcierge, href: "/concierge" },
    { label: f.submitArticle, href: "/contribute" },
  ];
  resourcesLinks.forEach((link, i) => {
    items.push(makeItem(NAV_ZONE_KEYS.FOOTER_RESOURCES, locale, link.label, link.href, i + 1));
  });

  const insightsLinks = [
    { label: f.marketIntelligence, href: "/insights?category=market-intelligence" },
    { label: f.investmentGuides, href: "/insights?category=investment-guides" },
    { label: f.goldenVisa, href: "/insights?category=golden-visa" },
    { label: f.journal, href: "/insights" },
  ];
  insightsLinks.forEach((link, i) => {
    items.push(makeItem(NAV_ZONE_KEYS.FOOTER_INSIGHTS, locale, link.label, link.href, i + 1));
  });

  items.push(
    makeItem(NAV_ZONE_KEYS.FOOTER_ABOUT, locale, f.aboutUs, "/about", 1),
  );

  const socialLinks = [
    { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
    { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
    { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
    { label: "Youtube", href: "https://youtube.com", icon: "youtube" },
  ];
  socialLinks.forEach((link, i) => {
    items.push(
      makeItem(NAV_ZONE_KEYS.FOOTER_FOLLOW_US, locale, link.label, link.href, i + 1, {
        icon: link.icon,
        open_in_new_tab: true,
        seo_path: null,
      }),
    );
  });

  const legalLinks = [
    { label: f.privacy, href: "/legal#overview" },
    { label: f.terms, href: "/legal#terms" },
    { label: f.cookies, href: "/legal#cookies" },
    { label: f.disclaimer, href: "/legal#disclaimer" },
    { label: f.reraInfo, href: "/legal#rera" },
  ];
  legalLinks.forEach((link, i) => {
    items.push(makeItem(NAV_ZONE_KEYS.FOOTER_LEGAL, locale, link.label, link.href, i + 1));
  });

  items.push(
    makeItem(NAV_ZONE_KEYS.FOOTER_LEGAL, locale, f.staffLogin, "/admin/login", 99, {
      seo_path: null,
    }),
  );

  return items;
}

function buildHeaderItems(locale: Locale, n: NavMessages): NavigationItem[] {
  const items: NavigationItem[] = [];
  let order = 1;

  for (const entry of mainNavItems) {
    items.push(
      makeItem(NAV_ZONE_KEYS.HEADER_MAIN, locale, n[entry.key as keyof NavMessages], entry.href, order++, {
        parent_key: null,
      }),
    );

    if ("dropdown" in entry) {
      const parentKey =
        entry.dropdown === "properties"
          ? HEADER_PARENT_KEYS.PROPERTIES
          : HEADER_PARENT_KEYS.OFF_PLAN;
      const dropdownItems =
        entry.dropdown === "properties" ? propertiesDropdownItems : offPlanDropdownItems;
      let childOrder = 1;
      for (const child of dropdownItems) {
        items.push(
          makeItem(
            NAV_ZONE_KEYS.HEADER_MAIN,
            locale,
            n[child.key as keyof NavMessages],
            child.href,
            childOrder++,
            { parent_key: parentKey },
          ),
        );
      }
    }
  }

  return items;
}

export function buildDefaultNavigation(locale: Locale): NavigationPayload {
  const f = footerMessages(locale);
  const n = navMessages(locale);

  return {
    zones: [
      makeZone(NAV_ZONE_KEYS.HEADER_MAIN, locale, "Main navigation", 0),
      ...buildFooterZones(locale, f),
    ],
    items: [...buildHeaderItems(locale, n), ...buildFooterItems(locale, f)],
  };
}

export function getZoneItems(
  payload: NavigationPayload,
  zoneKey: string,
  options: { includeHidden?: boolean; parentKey?: string | null } = {},
): NavigationItem[] {
  const { includeHidden = false, parentKey } = options;
  return payload.items
    .filter((item) => {
      if (item.zone_key !== zoneKey) return false;
      if (!includeHidden && !item.is_visible) return false;
      const itemParent = item.parent_key ?? null;
      if (parentKey !== undefined && itemParent !== parentKey) return false;
      return true;
    })
    .sort((a, b) => a.sort_order - b.sort_order || a.label.localeCompare(b.label));
}

export function getZoneTitle(
  payload: NavigationPayload,
  zoneKey: string,
  fallback: string,
): string {
  const zone = payload.zones.find((z) => z.key === zoneKey && z.is_visible);
  return zone?.title ?? fallback;
}

/** Top-level header nav entries (no parent). */
export function getHeaderNavItems(payload: NavigationPayload): NavigationItem[] {
  return getZoneItems(payload, NAV_ZONE_KEYS.HEADER_MAIN, { parentKey: null });
}

export function getHeaderDropdownItems(
  payload: NavigationPayload,
  parentKey: string,
): NavigationItem[] {
  return getZoneItems(payload, NAV_ZONE_KEYS.HEADER_MAIN, { parentKey });
}

/** Map nav item href to dropdown parent key when item has children. */
export function headerItemParentKey(item: NavigationItem): string | null {
  if (item.zone_key !== NAV_ZONE_KEYS.HEADER_MAIN || item.parent_key) {
    return null;
  }
  if (item.href === "/properties") return HEADER_PARENT_KEYS.PROPERTIES;
  if (item.href === "/off-plan") return HEADER_PARENT_KEYS.OFF_PLAN;
  return null;
}
