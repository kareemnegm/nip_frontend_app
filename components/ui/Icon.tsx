import { cn } from "@/lib/cn";
import {
  figmaIconSvgs,
  type FigmaIconName,
} from "./figma-icon-registry";

export type IconName =
  | FigmaIconName
  | "airport"
  | "dirham"
  | "dirham-circle"
  | "currency"
  | "alertTriangle"
  | "arrowRight"
  | "bath"
  | "bed"
  | "building"
  | "calendar"
  | "check"
  | "chevronDown"
  | "chevronLeft"
  | "chevronRight"
  | "clock"
  | "close"
  | "crane"
  | "developer"
  | "downtown"
  | "error404"
  | "facebook"
  | "family"
  | "floorplan"
  | "frown"
  | "globe"
  | "globe-presence"
  | "grid"
  | "grow"
  | "handover"
  | "home"
  | "image"
  | "instagram"
  | "linkedin"
  | "list"
  | "lock"
  | "mail"
  | "mapPin"
  | "menu"
  | "metro"
  | "mortgage"
  | "park"
  | "percent"
  | "pencil"
  | "phone"
  | "plus"
  | "reference"
  | "search"
  | "send"
  | "sofa"
  | "upload"
  | "user"
  | "youtube"
  | "area"
  | "star"
  | "skyline"
  | "concierge";

const iconAliases: Partial<Record<IconName, FigmaIconName>> = {
  currency: "dirham",
  user: "developer",
  home: "building",
  calendar: "handover",
  chevronLeft: "arrowRight",
  chevronRight: "arrowRight",
};

export type IconProps = {
  name: IconName;
  className?: string;
  title?: string;
};

const fallbackStrokePaths: Partial<Record<IconName, React.ReactNode>> = {
  alertTriangle: (
    <path d="M10.3 4.3 2.1 18a2 2 0 0 0 1.7 3h16.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01" />
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  chevronLeft: <path d="m15 18-6-6 6-6" />,
  chevronRight: <path d="m9 18 6-6-6-6" />,
  clock: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3.5 2" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </>
  ),
  frown: (
    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.5 15.5a4.5 4.5 0 0 1 7 0M9 9.5h.01M15 9.5h.01" />
  ),
  pencil: <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  search: <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3" />,
  send: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />,
  upload: (
    <path d="M12 15V3M8 7l4-4 4 4M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" />
  ),
};

function resolveFigmaIcon(name: IconName): FigmaIconName | null {
  if (name in figmaIconSvgs) {
    return name as FigmaIconName;
  }
  const alias = iconAliases[name];
  if (alias) {
    return alias;
  }
  if (name === "currency") {
    return "dirham";
  }
  return null;
}

export function Icon({ name, className, title }: IconProps) {
  const figmaName = resolveFigmaIcon(name);
  const svgMarkup = figmaName ? figmaIconSvgs[figmaName] : null;

  if (svgMarkup) {
    return (
      <span
        aria-hidden={title ? undefined : true}
        aria-label={title}
        className={cn(
          "inline-flex h-5 w-5 shrink-0 items-center justify-center text-current [&>svg]:h-full [&>svg]:w-full",
          className,
        )}
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
      />
    );
  }

  const fallback = fallbackStrokePaths[name];
  if (fallback) {
    return (
      <svg
        aria-hidden={title ? undefined : true}
        aria-label={title}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
        className={cn("h-5 w-5 shrink-0", className)}
      >
        {fallback}
      </svg>
    );
  }

  return (
    <svg
      aria-hidden={title ? undefined : true}
      aria-label={title}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      className={cn("h-5 w-5 shrink-0", className)}
    >
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}
