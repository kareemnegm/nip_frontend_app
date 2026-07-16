"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

type FieldShellProps = {
  label?: string;
  labelClassName?: string;
  children: React.ReactNode;
  className?: string;
};

export type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  labelClassName?: string;
  error?: string;
};

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  labelClassName?: string;
  error?: string;
};

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  labelClassName?: string;
  options: Array<{ label: string; value: string }>;
};

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  labelClassName?: string;
};

/** Default label look = former `text-xs font-semibold` (12/16/600) via the label-semibold token. */
const defaultLabelClasses = "text-label-semibold font-semibold text-ink-secondary";

function FieldShell({ label, labelClassName, children, className }: FieldShellProps) {
  return (
    <label className={cn("flex w-full flex-col gap-2 text-start", className)}>
      {label ? <span className={cn(defaultLabelClasses, labelClassName)}>{label}</span> : null}
      {children}
    </label>
  );
}

const fieldClasses =
  "h-11 w-full rounded-[var(--radius-field)] border border-border-default bg-white px-3.5 text-body-sm text-ink outline-none transition placeholder:text-text-inactive focus:border-brand focus:ring-2 focus:ring-sapphire-100 rtl:text-right";

export function TextInput({ label, labelClassName, className, error, ...props }: TextInputProps) {
  return (
    <FieldShell label={label} labelClassName={labelClassName}>
      <input className={cn(fieldClasses, error && "border-error", className)} {...props} />
      {error ? <span className="text-body-xs font-normal text-error">{error}</span> : null}
    </FieldShell>
  );
}

export function Textarea({ label, labelClassName, className, error, ...props }: TextareaProps) {
  return (
    <FieldShell label={label} labelClassName={labelClassName}>
      <textarea
        className={cn(fieldClasses, "min-h-28 resize-y py-3 rtl:text-right", error && "border-error", className)}
        {...props}
      />
      {error ? <span className="text-body-xs font-normal text-error">{error}</span> : null}
    </FieldShell>
  );
}

export function Select({ label, labelClassName, options, className, value, defaultValue, onChange, ...props }: SelectProps) {
  // Placeholder options (empty value) render in the same muted color as other
  // fields' placeholder text — the browser default paints select text black
  // regardless of whether a real value was picked, so we track it ourselves.
  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(
    String(defaultValue ?? options[0]?.value ?? ""),
  );

  const currentValue = isControlled ? String(value) : uncontrolledValue;
  const isPlaceholder = currentValue === "";

  const selectProps = isControlled
    ? { value }
    : { defaultValue: defaultValue ?? options[0]?.value };

  return (
    <FieldShell label={label} labelClassName={labelClassName}>
      <select
        className={cn(
          fieldClasses,
          "appearance-auto",
          isPlaceholder && "text-text-inactive",
          className,
        )}
        onChange={(event) => {
          if (!isControlled) {
            setUncontrolledValue(event.target.value);
          }
          onChange?.(event);
        }}
        {...selectProps}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function Checkbox({ label, labelClassName, className, ...props }: CheckboxProps) {
  return (
    <label className="flex items-start gap-3 text-body-xs text-ink-secondary">
      <input
        type="checkbox"
        className={cn(
          "mt-0.5 h-4 w-4 rounded border-line text-brand focus:ring-brand",
          className,
        )}
        {...props}
      />
      <span className={labelClassName}>{label}</span>
    </label>
  );
}

export { PhoneInput } from "./PhoneInput";
export type { PhoneInputProps } from "./PhoneInput";
