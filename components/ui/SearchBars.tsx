import { Icon } from "./Icon";

const filterOptions = [
  { label: "Location", value: "" },
  { label: "Palm Jumeirah", value: "palm-jumeirah" },
  { label: "Dubai Marina", value: "dubai-marina" },
];

const typeOptions = [
  { label: "Type", value: "" },
  { label: "Apartment", value: "apartment" },
  { label: "Villa", value: "villa" },
];

const priceOptions = [
  { label: "Price", value: "" },
  { label: "AED 1M+", value: "1000000" },
  { label: "AED 5M+", value: "5000000" },
];

const bedsOptions = [
  { label: "Beds", value: "" },
  { label: "1 Bed", value: "1" },
  { label: "2 Beds", value: "2" },
  { label: "3+ Beds", value: "3" },
];

const filterSelectClassName =
  "h-[38px] w-full min-w-0 appearance-none rounded-[var(--radius-field)] border border-line bg-white bg-[length:10px] bg-[right_12px_center] bg-no-repeat pl-3.5 pr-8 text-body-sm font-medium text-ink-secondary outline-none lg:w-[110px] lg:shrink-0";

function FilterSelect({
  "aria-label": ariaLabel,
  options,
}: {
  "aria-label": string;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="relative lg:w-[110px] lg:shrink-0">
      <select aria-label={ariaLabel} className={filterSelectClassName} defaultValue="">
        {options.map((option) => (
          <option key={option.value || option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <Icon
        name="chevronDown"
        className="pointer-events-none absolute right-3 top-1/2 h-2.5 w-2.5 -translate-y-1/2 text-ink-secondary"
      />
    </div>
  );
}

export function PropertyFilterBar() {
  return (
    <form className="flex flex-wrap items-center gap-2.5 rounded-[var(--radius-card)] border border-line bg-white p-3 shadow-[var(--shadow-card)] lg:flex-nowrap">
      <input
        type="search"
        aria-label="Search by community, project or area"
        placeholder="Search by community, project or area"
        className="h-[38px] w-full min-w-[200px] rounded-[var(--radius-field)] bg-sapphire-50 px-3.5 text-body-sm text-ink outline-none placeholder:text-text-inactive lg:w-[470px] lg:shrink-0"
      />
      <FilterSelect aria-label="Location" options={filterOptions} />
      <FilterSelect aria-label="Type" options={typeOptions} />
      <FilterSelect aria-label="Price" options={priceOptions} />
      <FilterSelect aria-label="Beds" options={bedsOptions} />
      <button
        type="submit"
        className="inline-flex h-[38px] w-full shrink-0 items-center justify-center rounded-[var(--radius-field)] bg-brand px-[22px] text-overline font-semibold text-white transition-colors hover:bg-brand-hover lg:w-[96px]"
      >
        Search
      </button>
    </form>
  );
}

export function GenericSearchBar() {
  return (
    <form className="rounded-lg bg-surface-muted p-4">
      <div className="grid gap-3 rounded-[var(--radius-field)] bg-white p-2 sm:grid-cols-[1fr_auto]">
        <input
          type="search"
          aria-label="Search properties, areas or projects"
          placeholder="Search properties, areas or projects"
          className="h-11 w-full rounded-[var(--radius-field)] border border-line px-4 text-sm text-ink outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="inline-flex h-11 items-center justify-center rounded-[var(--radius-field)] bg-sapphire-600 px-6 text-xs font-semibold text-white"
        >
          Search
        </button>
      </div>
    </form>
  );
}
