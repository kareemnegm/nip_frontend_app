import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function HomeSearchSection() {
  return (
    <section className="bg-surface-muted py-7">
      <Container>
        <form className="mx-auto max-w-[640px]">
          <p className="mb-3 text-center text-xs font-semibold uppercase leading-4 text-ink-tertiary">
            Looking for something specific?
          </p>
          <div className="flex flex-col gap-3 rounded-[8px] border border-line bg-white py-1.5 pl-[18px] pr-1.5 sm:flex-row sm:items-center">
            <input
              type="search"
              aria-label="Search"
              placeholder="Search properties, areas or projects"
              className="min-h-9 flex-1 text-[13px] leading-[18px] text-ink placeholder:text-text-inactive outline-none"
            />
            <Button type="submit" size="md" className="w-full sm:w-auto">
              Search
            </Button>
          </div>
        </form>
      </Container>
    </section>
  );
}
