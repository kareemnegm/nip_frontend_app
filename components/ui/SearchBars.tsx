import { Button } from "./Button";
import { Select, TextInput } from "./FormControls";

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

export function PropertyFilterBar() {
  return (
    <form className="rounded-lg bg-surface-muted p-4">
      <div className="grid gap-3 rounded-[var(--radius-field)] border border-line bg-white p-2 lg:grid-cols-[1fr_130px_110px_110px_110px_auto]">
        <TextInput
          aria-label="Search by community, project or area"
          placeholder="Search by community, project or area"
        />
        <Select aria-label="Location" options={filterOptions} />
        <Select aria-label="Type" options={typeOptions} />
        <Select aria-label="Price" options={priceOptions} />
        <Select aria-label="Beds" options={bedsOptions} />
        <Button type="submit" size="sm">
          Search
        </Button>
      </div>
    </form>
  );
}

export function GenericSearchBar() {
  return (
    <form className="rounded-lg bg-surface-muted p-4">
      <div className="grid gap-3 rounded-[var(--radius-field)] bg-white p-2 sm:grid-cols-[1fr_auto]">
        <TextInput
          aria-label="Search properties, areas or projects"
          placeholder="Search properties, areas or projects"
        />
        <Button type="submit" size="sm">
          Search
        </Button>
      </div>
    </form>
  );
}
