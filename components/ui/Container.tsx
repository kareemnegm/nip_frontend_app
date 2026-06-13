import { cn } from "@/lib/cn";
import { siteContentClassName } from "./SiteChrome";

export type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={cn(siteContentClassName, className)}>{children}</div>
  );
}
