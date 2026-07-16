"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Country = {
  name: string;
  /** ISO 3166-1 alpha-2, lowercase (used for the flag image). */
  iso2: string;
  /** International dial code including the leading "+". */
  dial: string;
};

/** GCC markets first, then the rest alphabetically. */
const COUNTRIES: Country[] = [
  { name: "United Arab Emirates", iso2: "ae", dial: "+971" },
  { name: "Saudi Arabia", iso2: "sa", dial: "+966" },
  { name: "Qatar", iso2: "qa", dial: "+974" },
  { name: "Kuwait", iso2: "kw", dial: "+965" },
  { name: "Bahrain", iso2: "bh", dial: "+973" },
  { name: "Oman", iso2: "om", dial: "+968" },
  { name: "Australia", iso2: "au", dial: "+61" },
  { name: "Bangladesh", iso2: "bd", dial: "+880" },
  { name: "Belgium", iso2: "be", dial: "+32" },
  { name: "Canada", iso2: "ca", dial: "+1" },
  { name: "China", iso2: "cn", dial: "+86" },
  { name: "Egypt", iso2: "eg", dial: "+20" },
  { name: "France", iso2: "fr", dial: "+33" },
  { name: "Germany", iso2: "de", dial: "+49" },
  { name: "Greece", iso2: "gr", dial: "+30" },
  { name: "Hong Kong", iso2: "hk", dial: "+852" },
  { name: "India", iso2: "in", dial: "+91" },
  { name: "Indonesia", iso2: "id", dial: "+62" },
  { name: "Iraq", iso2: "iq", dial: "+964" },
  { name: "Ireland", iso2: "ie", dial: "+353" },
  { name: "Italy", iso2: "it", dial: "+39" },
  { name: "Japan", iso2: "jp", dial: "+81" },
  { name: "Jordan", iso2: "jo", dial: "+962" },
  { name: "Lebanon", iso2: "lb", dial: "+961" },
  { name: "Malaysia", iso2: "my", dial: "+60" },
  { name: "Morocco", iso2: "ma", dial: "+212" },
  { name: "Netherlands", iso2: "nl", dial: "+31" },
  { name: "New Zealand", iso2: "nz", dial: "+64" },
  { name: "Nigeria", iso2: "ng", dial: "+234" },
  { name: "Pakistan", iso2: "pk", dial: "+92" },
  { name: "Philippines", iso2: "ph", dial: "+63" },
  { name: "Portugal", iso2: "pt", dial: "+351" },
  { name: "Russia", iso2: "ru", dial: "+7" },
  { name: "Singapore", iso2: "sg", dial: "+65" },
  { name: "South Africa", iso2: "za", dial: "+27" },
  { name: "South Korea", iso2: "kr", dial: "+82" },
  { name: "Spain", iso2: "es", dial: "+34" },
  { name: "Sweden", iso2: "se", dial: "+46" },
  { name: "Switzerland", iso2: "ch", dial: "+41" },
  { name: "Thailand", iso2: "th", dial: "+66" },
  { name: "Turkey", iso2: "tr", dial: "+90" },
  { name: "Ukraine", iso2: "ua", dial: "+380" },
  { name: "United Kingdom", iso2: "gb", dial: "+44" },
  { name: "United States", iso2: "us", dial: "+1" },
];

// De-duplicate accidental repeats (e.g. Qatar) while keeping first order.
const UNIQUE_COUNTRIES = COUNTRIES.filter(
  (country, index) => COUNTRIES.findIndex((c) => c.iso2 === country.iso2) === index,
);

const DEFAULT_COUNTRY = UNIQUE_COUNTRIES[0];

const fieldClasses =
  "h-11 rounded-[var(--radius-field)] border border-border-default bg-white text-body-sm text-ink outline-none transition placeholder:text-text-inactive focus:border-brand focus:ring-2 focus:ring-sapphire-100";

function Flag({ iso2, className }: { iso2: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/${iso2}.svg`}
      alt=""
      aria-hidden
      width={24}
      height={16}
      className={cn("h-4 w-6 shrink-0 rounded-[2px] object-cover", className)}
    />
  );
}

export type PhoneInputProps = {
  label?: string;
  labelClassName?: string;
  placeholder?: string;
  error?: string;
  value?: string;
  defaultDial?: string;
  onChange?: (event: { target: { value: string } }) => void;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value" | "type"
>;

export function PhoneInput({
  label = "Phone Number",
  labelClassName,
  placeholder = "Phone number",
  error,
  onChange,
  defaultDial = DEFAULT_COUNTRY.dial,
  value,
  className,
  ...props
}: PhoneInputProps) {
  void value; // parent stores the combined dial + number emitted via onChange
  const [country, setCountry] = useState<Country>(
    () => UNIQUE_COUNTRIES.find((c) => c.dial === defaultDial) ?? DEFAULT_COUNTRY,
  );
  const [number, setNumber] = useState("");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return UNIQUE_COUNTRIES;
    return UNIQUE_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.replace("+", "").includes(q.replace("+", "")) ||
        c.iso2.includes(q),
    );
  }, [query]);

  function emit(dial: string, localNumber: string) {
    const trimmed = localNumber.trim();
    onChange?.({ target: { value: trimmed ? `${dial} ${trimmed}` : "" } });
  }

  function selectCountry(next: Country) {
    setCountry(next);
    setOpen(false);
    setQuery("");
    emit(next.dial, number);
  }

  function handleNumberChange(event: React.ChangeEvent<HTMLInputElement>) {
    const next = event.target.value;
    setNumber(next);
    emit(country.dial, next);
  }

  useEffect(() => {
    if (!open) return;
    function onDocClick(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  return (
    <label className="flex w-full flex-col gap-2 text-start">
      {label ? (
        <span className={cn("text-label-semibold font-semibold text-ink-secondary", labelClassName)}>
          {label}
        </span>
      ) : null}
      <div ref={rootRef} className="relative flex gap-3 rtl:flex-row-reverse">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listboxId}
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            fieldClasses,
            "flex w-[104px] shrink-0 items-center gap-1.5 px-2.5 font-semibold",
          )}
        >
          <Flag iso2={country.iso2} />
          <span className="text-ink">{country.dial}</span>
          <svg
            className={cn("ms-auto h-4 w-4 text-ink-secondary transition-transform", open && "rotate-180")}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          className={cn(fieldClasses, "min-w-0 flex-1 px-4 rtl:text-right", error && "border-error", className)}
          placeholder={placeholder}
          value={number}
          onChange={handleNumberChange}
          {...props}
        />

        {open ? (
          <div className="absolute start-0 top-[calc(100%+6px)] z-20 w-[300px] max-w-[calc(100vw-3rem)] overflow-hidden rounded-[var(--radius-field)] border border-line bg-white shadow-[var(--shadow-card)]">
            <div className="border-b border-line p-2">
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search country"
                className="h-9 w-full rounded-[var(--radius-field)] border border-line px-3 text-body-sm font-normal text-ink outline-none focus:border-brand"
              />
            </div>
            <ul id={listboxId} role="listbox" className="max-h-60 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className="px-3 py-2 text-body-sm font-normal text-ink-secondary">No results</li>
              ) : (
                filtered.map((c) => (
                  <li key={c.iso2}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={c.iso2 === country.iso2}
                      onClick={() => selectCountry(c)}
                      className={cn(
                        "flex w-full items-center gap-2.5 px-3 py-2 text-start text-body-sm font-normal text-ink hover:bg-sapphire-50",
                        c.iso2 === country.iso2 && "bg-sapphire-50",
                      )}
                    >
                      <Flag iso2={c.iso2} />
                      <span className="flex-1 truncate">{c.name}</span>
                      <span className="text-ink-secondary">{c.dial}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        ) : null}
      </div>
      {error ? <span className="text-body-xs font-normal text-error">{error}</span> : null}
    </label>
  );
}
