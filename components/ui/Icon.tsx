import { cn } from "@/lib/cn";

export type IconName =
  | "arrowRight"
  | "bath"
  | "bed"
  | "building"
  | "calendar"
  | "check"
  | "chevronDown"
  | "clock"
  | "currency"
  | "globe"
  | "grid"
  | "home"
  | "mail"
  | "mapPin"
  | "phone"
  | "percent"
  | "search"
  | "sofa"
  | "user";

export type IconProps = {
  name: IconName;
  className?: string;
  title?: string;
};

const paths: Record<IconName, React.ReactNode> = {
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
  bath: <path d="M5 11h14v3a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-3Zm3 7v2m8-2v2M7 11V7a3 3 0 0 1 3-3h1" />,
  bed: <path d="M4 18V8m0 7h16m0 3V9a3 3 0 0 0-3-3h-5v9M4 10h8" />,
  building: <path d="M5 20V5h9v15M9 8h1m-1 4h1m-1 4h1m5 4v-9h5v9m-2-6h1m-1 3h1" />,
  calendar: <path d="M7 3v3m10-3v3M4 8h16M5 5h14a1 1 0 0 1 1 1v13H4V6a1 1 0 0 1 1-1Z" />,
  check: <path d="m5 12 4 4L19 6" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  clock: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2" />,
  currency: <path d="M7 6h7a4 4 0 0 1 0 8H7m0-8v14m0-10h9M4 18h14" />,
  globe: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-9-9h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />,
  grid: <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" />,
  home: <path d="m3 11 9-8 9 8m-16 0v9h14v-9M9 20v-6h6v6" />,
  mail: <path d="M4 6h16v12H4V6Zm0 1 8 6 8-6" />,
  mapPin: <path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Zm0-8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
  percent: <path d="m5 19 14-14M8 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
  phone: <path d="M7 4h3l1.5 4-2 1.2a12 12 0 0 0 5.3 5.3l1.2-2L20 14v3a3 3 0 0 1-3 3A13 13 0 0 1 4 7a3 3 0 0 1 3-3Z" />,
  search: <path d="m20 20-4.5-4.5M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z" />,
  sofa: <path d="M5 12V9a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3m-16 6v-4a2 2 0 0 1 4 0v1h10v-1a2 2 0 0 1 4 0v4H3Z" />,
  user: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0" />,
};

export function Icon({ name, className, title }: IconProps) {
  return (
    <svg
      aria-hidden={title ? undefined : true}
      aria-label={title}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      className={cn("h-5 w-5 shrink-0", className)}
    >
      {paths[name]}
    </svg>
  );
}
