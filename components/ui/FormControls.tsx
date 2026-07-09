import { cn } from "@/lib/cn";

type FieldShellProps = {
  label?: string;
  children: React.ReactNode;
  className?: string;
};

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
};

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: Array<{ label: string; value: string }>;
};

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

function FieldShell({ label, children, className }: FieldShellProps) {
  return (
    <label className={cn("flex flex-col gap-2 text-start text-xs font-semibold text-ink-secondary", className)}>
      {label ? <span>{label}</span> : null}
      {children}
    </label>
  );
}

const fieldClasses =
  "h-11 w-full rounded-[var(--radius-field)] border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-sapphire-100 rtl:text-right";

export function TextInput({ label, className, error, ...props }: TextInputProps) {
  return (
    <FieldShell label={label}>
      <input className={cn(fieldClasses, error && "border-error", className)} {...props} />
      {error ? <span className="text-xs font-normal text-error">{error}</span> : null}
    </FieldShell>
  );
}

export function Textarea({ label, className, error, ...props }: TextareaProps) {
  return (
    <FieldShell label={label}>
      <textarea
        className={cn(fieldClasses, "min-h-28 resize-y py-4 rtl:text-right", error && "border-error", className)}
        {...props}
      />
      {error ? <span className="text-xs font-normal text-error">{error}</span> : null}
    </FieldShell>
  );
}

export function Select({ label, options, className, ...props }: SelectProps) {
  return (
    <FieldShell label={label}>
      <select className={cn(fieldClasses, "appearance-auto", className)} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className="flex items-start gap-3 text-xs text-ink-secondary">
      <input
        type="checkbox"
        className={cn(
          "mt-0.5 h-4 w-4 rounded border-line text-brand focus:ring-brand",
          className,
        )}
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}

export { PhoneInput } from "./PhoneInput";
export type { PhoneInputProps } from "./PhoneInput";
