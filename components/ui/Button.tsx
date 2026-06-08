import Link from "next/link";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "light"
  | "muted"
  | "outline"
  | "link";

export type ButtonSize = "sm" | "md" | "lg";

type BaseButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  href?: string;
  children: React.ReactNode;
};

export type ButtonProps = BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps>;

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover active:bg-brand-pressed",
  secondary: "bg-sapphire-500 text-white hover:bg-sapphire-600",
  light: "bg-sapphire-100 text-brand hover:bg-sapphire-200",
  muted: "bg-ink-tertiary text-white hover:bg-ink-secondary",
  outline:
    "border border-brand bg-transparent text-brand hover:bg-sapphire-50",
  link: "bg-transparent px-0 text-brand hover:text-brand-hover",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-4 text-xs",
  md: "h-10 px-6 text-sm",
  lg: "h-12 px-8 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-field)] font-semibold transition-colors disabled:pointer-events-none disabled:opacity-40",
    variantClasses[variant],
    variant !== "link" && sizeClasses[size],
    variant === "link" && "h-auto text-sm",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
