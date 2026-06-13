import { cn } from "@/lib/cn";
import { brandIcons, isBrandIcon } from "./brand-icons";

export type IconName =
  | "alertTriangle"
  | "arrowRight"
  | "bath"
  | "bed"
  | "building"
  | "calendar"
  | "check"
  | "chevronDown"
  | "clock"
  | "close"
  | "currency"
  | "facebook"
  | "frown"
  | "globe"
  | "grid"
  | "home"
  | "instagram"
  | "linkedin"
  | "list"
  | "lock"
  | "mail"
  | "mapPin"
  | "menu"
  | "phone"
  | "percent"
  | "plus"
  | "search"
  | "send"
  | "sofa"
  | "upload"
  | "user"
  | "youtube";

export type IconProps = {
  name: IconName;
  className?: string;
  title?: string;
};

const strokePaths: Record<
  Exclude<IconName, keyof typeof brandIcons>,
  React.ReactNode
> = {
  alertTriangle: (
    <path d="M10.3 4.3 2.1 18a2 2 0 0 0 1.7 3h16.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01" />
  ),
  arrowRight: <path d="M5 12h14m-7-7 7 7-7 7" />,
  bath: (
    <path d="M4 12V6a2 2 0 0 1 4 0M2 12h20M4 12v3a5 5 0 0 0 5 5h6a5 5 0 0 0 5-5v-3M7 20l-1.5 2M17 20l1.5 2" />
  ),
  bed: (
    <path d="M3 5v14M3 10h16a2 2 0 0 1 2 2v7M3 16h18M7 10V7a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v3" />
  ),
  building: (
    <path d="M6 21V4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v17M6 12H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2M15 9h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-3M9 7h3M9 11h3M9 15h3" />
  ),
  calendar: (
    <path d="M8 2v4M16 2v4M3 9h18M5 4h14a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1ZM9 15l2 2 4-4" />
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  clock: (
    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3.5 2" />
  ),
  close: <path d="m6 6 12 12M18 6 6 18" />,
  currency: (
    <path d="M9 4v16M9 4h3.5a6 6 0 0 1 0 12H9M5 10h9M5 14h9" />
  ),
  frown: (
    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM8.5 15.5a4.5 4.5 0 0 1 7 0M9 9.5h.01M15 9.5h.01" />
  ),
  grid: <path d="M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z" />,
  home: (
    <path d="m3 10.2 9-7.2 9 7.2M5 9v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9M9 21v-6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6" />
  ),
  list: <path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01" />,
  lock: (
    <path d="M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1ZM8 11V7a4 4 0 0 1 8 0v4" />
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  percent: (
    <path d="M19 5 5 19M6.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM17.5 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  search: (
    <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.3-4.3" />
  ),
  send: <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />,
  sofa: (
    <path d="M5 10V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v2M3 14a2 2 0 0 1 4 0v2h10v-2a2 2 0 0 1 4 0v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4ZM6 19v2M18 19v2" />
  ),
  upload: (
    <path d="M12 15V3M8 7l4-4 4 4M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" />
  ),
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 21a7.5 7.5 0 0 1 15 0" />,
};

export function Icon({ name, className, title }: IconProps) {
  if (isBrandIcon(name)) {
    const brand = brandIcons[name];

    return (
      <svg
        aria-hidden={title ? undefined : true}
        aria-label={title}
        viewBox={brand.viewBox}
        fill="none"
        className={cn("h-5 w-5 shrink-0", className)}
      >
        {brand.paths.map((path, index) => (
          <path
            key={`${name}-${index}`}
            d={path}
            fill="currentColor"
            fillRule={brand.fillRule}
            clipRule={brand.fillRule}
          />
        ))}
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
      {strokePaths[name]}
    </svg>
  );
}
