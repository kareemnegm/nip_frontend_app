import { cn } from "@/lib/cn";

type FieldShellProps = {
  label?: string;
  children: React.ReactNode;
  className?: string;
};

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
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
    <label className={cn("flex flex-col gap-2 text-xs font-semibold text-ink-secondary", className)}>
      {label ? <span>{label}</span> : null}
      {children}
    </label>
  );
}

const fieldClasses =
  "h-11 w-full rounded-[var(--radius-field)] border border-line bg-white px-4 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-2 focus:ring-sapphire-100";

export function TextInput({ label, className, ...props }: TextInputProps) {
  return (
    <FieldShell label={label}>
      <input className={cn(fieldClasses, className)} {...props} />
    </FieldShell>
  );
}

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <FieldShell label={label}>
      <textarea
        className={cn(fieldClasses, "min-h-28 resize-y py-4", className)}
        {...props}
      />
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

export function PhoneInput({
  label = "Phone Number",
  placeholder = "Phone number",
}: {
  label?: string;
  placeholder?: string;
}) {
  return (
    <FieldShell label={label}>
      <div className="grid grid-cols-[88px_1fr] gap-3">
        <select className={cn(fieldClasses, "px-2")} defaultValue="+971">
          <option value="+971">AE +971</option>
        </select>
        <input className={fieldClasses} placeholder={placeholder} />
      </div>
    </FieldShell>
  );
}
