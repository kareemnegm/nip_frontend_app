import Link from "next/link";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "light"
  | "muted"
  | "outline"
  | "outlineInverse"
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
  primary: "bg-sapphire-600 text-white hover:bg-brand-hover active:bg-brand-pressed",
  secondary: "bg-sapphire-500 text-white hover:bg-sapphire-600",
  accent: "bg-accent text-white hover:bg-accent-hover active:bg-accent-pressed",
  light: "bg-sapphire-100 text-brand hover:bg-sapphire-200",
  muted: "bg-ink-tertiary text-white hover:bg-ink-secondary",
  outline:
    "border border-brand bg-transparent text-brand hover:bg-sapphire-50",
  outlineInverse:
    "border border-white bg-transparent text-white hover:bg-white/10",
  link: "bg-transparent px-0 text-brand hover:text-brand-hover",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-4 text-xs leading-4",
  md: "px-6 py-[9px] text-xs leading-4",
  lg: "px-6 py-[9px] text-xs leading-4",
};

export function SpeakWithNipButton({
  className,
  href = "/contact",
  onClick,
}: {
  className?: string;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span className="font-semibold">Speak with</span>
      <span className="font-[family-name:var(--font-logo)] font-medium">
        NIP
      </span>
    </>
  );

  const classes = cn(
    "inline-flex items-center justify-center gap-[3px] rounded-[var(--radius-field)] bg-sapphire-600 px-[24px] py-[9px] text-xs leading-4 text-white transition-colors hover:bg-brand-hover active:bg-brand-pressed",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} onClick={onClick} type="button">
      {content}
    </button>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-field)] font-semibold leading-4 transition-colors disabled:pointer-events-none disabled:opacity-40",
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
