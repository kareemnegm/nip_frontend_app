import { cn } from "@/lib/cn";

export type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: 1 | 2 | 3;
  as?: "div" | "section" | "article" | "li";
};

export function Reveal({
  children,
  className,
  delay,
  as: Tag = "div",
}: RevealProps) {
  return (
    <Tag
      data-reveal
      {...(delay ? { "data-reveal-delay": String(delay) } : {})}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
