import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function HomeSearchSection() {
  return (
    <section className="bg-surface-muted py-10 sm:py-12">
      <Container>
        <form className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-3 rounded-[var(--radius-field)] border border-line bg-white p-2 sm:flex-row sm:items-center">
            <input
              type="search"
              aria-label="Search"
              placeholder="Looking for something specific?"
              className="min-h-11 flex-1 px-4 text-sm uppercase tracking-wide text-ink placeholder:text-ink-tertiary outline-none"
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
