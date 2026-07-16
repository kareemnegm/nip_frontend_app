import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * The design system defines custom typography tokens (e.g. `text-display-lg`,
 * `text-body-sm`) as Tailwind font sizes. Out of the box, tailwind-merge can't
 * tell these apart from color utilities like `text-brand`, so it would treat
 * `text-brand text-display-lg` as a conflict and drop the color — leaving
 * headings rendering in the inherited near-black body color.
 *
 * Registering the custom font-size token names here lets tailwind-merge keep
 * the color AND the size together.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-hero",
            "display-hero-sm",
          "display-lg",
          "display-sm",
          "stat-value",
            "stat-value-sm",
          "heading-h1",
          "heading-h2",
          "h1",
            "h2",
            "h3",
            "h4",
            "body-lg",
            "body-regular",
            "body-md",
            "body-sm",
            "body-xs",
            "overline",
            "label",
            "label-semibold",
            "label-muted",
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
