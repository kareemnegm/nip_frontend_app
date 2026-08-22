export type SectionCms = {
  relUrl: string;
  titleKey: string;
  descKey?: string;
  bodyKey?: string;
  eyebrowKey?: string;
  imageKey?: string;
};

export type SectionHeadingEditable = {
  relUrl: string;
  titleKey: string;
  descKey?: string;
};

export function toSectionHeadingEditable(cms: SectionCms): SectionHeadingEditable {
  return {
    relUrl: cms.relUrl,
    titleKey: cms.titleKey,
    descKey: cms.descKey,
  };
}

export function buildSectionCms(
  relUrl: string,
  blockPrefix: string,
  slots: Array<"eyebrow" | "title" | "desc" | "body" | "image">,
): SectionCms {
  return {
    relUrl,
    titleKey: `${blockPrefix}-title`,
    ...(slots.includes("eyebrow") ? { eyebrowKey: `${blockPrefix}-eyebrow` } : {}),
    ...(slots.includes("desc") ? { descKey: `${blockPrefix}-desc` } : {}),
    ...(slots.includes("body") ? { bodyKey: `${blockPrefix}-body` } : {}),
    ...(slots.includes("image") ? { imageKey: `${blockPrefix}-image` } : {}),
  };
}
