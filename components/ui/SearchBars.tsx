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
