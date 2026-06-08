import { Button } from "./ui/Button";
import { Logo } from "./ui/Logo";

export function StickyCta() {
  return (
    <aside className="bg-background py-4">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 rounded-[var(--radius-field)] bg-ink px-6 py-5 text-white">
          <Logo inverted />
          <p className="hidden text-sm text-white/70 md:block">
            Discreet Advisory for Elevated Living
          </p>
          <Button href="/contact" variant="secondary" size="sm">
            Speak with NIP
          </Button>
        </div>
      </div>
    </aside>
  );
}
